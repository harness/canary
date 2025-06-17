import { createWriteStream, promises as fs } from 'fs'
import https from 'https'
import path from 'path'
import { URL } from 'url'

import { config as dotenvConfig } from 'dotenv'
import { Liquid } from 'liquidjs'
import { optimize } from 'svgo'

const engine = new Liquid()

// Load environment variables from .env file
dotenvConfig()

// Default configuration - Can be overridden when importing
const DEFAULT_CONFIG = {
  FIGMA_TOKEN: process.env.FIGMA_TOKEN,
  FILE_ID: process.env.FIGMA_FILE_ID,
  PAGE_NAME: process.env.FIGMA_LOGO_PAGE_NAME,
  OUTPUT_DIR: './src/components/logo-v2/logos',
  FORMAT: 'svg', // 'svg', 'png', 'jpg', 'pdf'
  SCALE: 1, // Only for raster formats
  CONCURRENT_DOWNLOADS: 10
}

class FigmaLogoDownloader {
  constructor(config) {
    this.config = config
    this.baseUrl = 'https://api.figma.com/v1'
  }

  async makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`
      const options = {
        headers: {
          'X-Figma-Token': this.config.FIGMA_TOKEN,
          'User-Agent': 'Figma-Icons-Downloader/1.0'
        }
      }

      https
        .get(url, options, res => {
          let data = ''

          res.on('data', chunk => {
            data += chunk
          })

          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve(JSON.parse(data))
              } catch (error) {
                reject(new Error(`Failed to parse JSON: ${error.message}`))
              }
            } else {
              reject(new Error(`Figma API error: ${res.statusCode} ${res.statusMessage}`))
            }
          })
        })
        .on('error', reject)
    })
  }

  async getFileStructure() {
    console.log('📄 Fetching file structure...')
    return this.makeRequest(`/files/${this.config.FILE_ID}`)
  }

  async getImageUrls(nodeIds, format = 'svg', scale = 1) {
    const nodeIdsString = nodeIds.join(',')
    const endpoint = `/images/${this.config.FILE_ID}?ids=${nodeIdsString}&format=${format}&scale=${scale}`
    console.log(`🔗 Getting image URLs for ${nodeIds.length} logos...`)
    return this.makeRequest(endpoint)
  }

  findLogosInPage(document, components, pageName) {
    const page = document.children.find(child => child.name === pageName)
    if (!page) {
      throw new Error(`Page "${pageName}" not found. Available pages: ${document.children.map(p => p.name).join(', ')}`)
    }

    const logos = []

    function traverseNode(node, depth = 0) {
      // Only component type needs to be downloaded

      if (node.type === 'COMPONENT') {
        const componentData = components[node.id]
        // Skip nested logos to avoid duplicates (only take top-level logos)
        if (depth <= 2) {
          logos.push({
            id: node.id,
            name: node.name,
            type: node.type,
            // Description will contain the fill color of logo
            fillColor: componentData?.description || ''
          })
        }
      }

      // Recursively check children, but limit depth to avoid deep nesting
      if (node.children && depth < 3) {
        node.children.forEach(child => traverseNode(child, depth + 1))
      }
    }

    page.children.forEach(child => traverseNode(child, 0))
    return logos
  }

  async downloadFile(url, filepath, fillColor) {
    return new Promise((resolve, reject) => {
      let parsedUrl

      try {
        parsedUrl = new URL(url)
      } catch (error) {
        reject(new Error(`Invalid URL: ${url} - ${error.message}`))
      }
      const isSvg = filepath.toLowerCase().endsWith('.svg')

      if (isSvg) {
        // For SVG files, we need to modify the content before saving
        https
          .get(parsedUrl, async res => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              let svgData = ''

              // Collect the data
              res.on('data', chunk => {
                svgData += chunk
              })

              // Process and save when complete
              res.on('end', async () => {
                try {
                  // Process SVG to replace colors with currentColor
                  const processedSvg = this.processSvgForTheming(svgData, fillColor)

                  // Write the processed SVG to file
                  await fs.writeFile(filepath, processedSvg, 'utf8')
                  resolve(true)
                } catch (error) {
                  reject(error)
                }
              })
            } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              // Handle redirects
              this.downloadFile(res.headers.location, filepath, fillColor).then(resolve).catch(reject)
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
            }
          })
          .on('error', reject)
      } else {
        // For non-SVG files, use the original streaming approach
        https
          .get(parsedUrl, res => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const fileStream = createWriteStream(filepath)
              res.pipe(fileStream)

              fileStream.on('finish', () => {
                fileStream.close()
                resolve(true)
              })

              fileStream.on('error', reject)
            } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              // Handle redirects
              this.downloadFile(res.headers.location, filepath, fillColor).then(resolve).catch(reject)
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
            }
          })
          .on('error', reject)
      }
    })
  }

  processSvgForTheming(svgContent, fillColor) {
    try {
      // Create a custom SVGO plugin that adds a background rect and centers the logo with padding
      const addBackgroundAndCenterLogoPlugin = {
        name: 'addBackgroundAndCenterLogo',
        type: 'perItem',
        fn: item => {
          // console.log('-----------');
          // console.log('item.type', item.type);
          // console.log('item', JSON.stringify(item, null, 2))
          // console.log('-----------');

          // Only process the root SVG element
          if (item.type === 'root' && item.children?.[0]?.name === 'svg') {
            const svgElement = item.children[0]

            // console.log('svgElement', svgElement)

            // Create a group to wrap all existing children with a transform for perfect centering
            if (svgElement.children && svgElement.children.length > 0) {
              // Clone the existing children
              const existingChildren = [...svgElement.children]

              // Add wrapper group for perfect centering
              // This uses a combination of techniques to ensure centering works across different SVG structures
              const centeringGroup = {
                type: 'element',
                name: 'g',
                attributes: {
                  // viewport is 18x18, hence added translate(9, 9) to center the logo
                  // scale(0.5625) is used to scale the logo to 56.25% of its original size,
                  // which is 18px if svg is 32px
                  // translate(-9, -9) is used to center the logo after scaling
                  transform: 'translate(9, 9) scale(0.5625) translate(-9, -9)'
                },
                children: existingChildren
              }

              // Replace the SVG's children with just the group and optional background
              if (fillColor) {
                // Create a background rect element
                const rectElement = {
                  type: 'element',
                  name: 'rect',
                  attributes: {
                    width: '100%',
                    height: '100%',
                    rx: '2px',
                    ry: '2px',
                    fill: fillColor
                  },
                  children: []
                }

                svgElement.children = [rectElement, centeringGroup]
              } else {
                svgElement.children = [centeringGroup]
              }
            }
          }
        }
      }

      // Optimize the SVG with our custom plugin
      const result = optimize(svgContent, {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                // Disable some plugins from the preset
                removeViewBox: false,
                // Keep important attributes
                removeUnknownsAndDefaults: {
                  keepRoleAttr: true,
                  keepAriaAttrs: true
                }
              }
            }
          },

          // Remove width/height attributes from root SVG
          {
            name: 'removeAttrs',
            params: {
              attrs: ['width', 'height']
            }
          },

          // Our custom plugin to add background and center the logo with padding
          addBackgroundAndCenterLogoPlugin
        ]
      })

      return result.data
    } catch (error) {
      console.error('Error processing SVG with SVGO:', error)
      // Fallback to the original SVG content if SVGO processing fails
      return svgContent
    }
  }

  sanitizeFilename(name) {
    // Remove or replace invalid filename characters
    return name
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/[^\w\-_.]/g, '')
      .replace(/^\./, '') // Remove leading period/fullstop
      .toLowerCase()
  }

  // Convert a filename to a valid TypeScript variable name (PascalCase)
  toComponentName(filename) {
    // Remove extension and convert to PascalCase
    return filename
      .replace(/\.svg$/, '')
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('')
  }

  // Convert a filename to a kebab-case key for the logo map
  toLogoKey(filename) {
    // Remove extension and ensure kebab-case
    return filename.replace(/\.svg$/, '').toLowerCase()
  }

  /**
   * Generate an logo-name-map.ts file with all successfully downloaded logos
   * @param {Array} results - Download results from downloadAllLogos
   * @returns {Promise<void>}
   */
  async generateLogoNameMap(results) {
    try {
      // Filter for successful downloads
      const successfulDownloads = results
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .map(r => r.value)
        .sort((a, b) => a.filename.localeCompare(b.filename))

      if (successfulDownloads.length === 0) {
        console.log('⚠️ No successful downloads, skipping logo map generation')
        return
      }

      // Data for the LiquidJS template
      const templateData = {
        logos: successfulDownloads.map(download => ({
          filename: download.filename,
          componentName: this.toComponentName(download.filename),
          logoKey: this.toLogoKey(download.filename)
        }))
      }

      // File template
      const template = `/**
 * Harness Design System
 * Generated logo map - DO NOT EDIT DIRECTLY
 */
{% for logo in logos %}
import {{ logo.componentName }} from './logos/{{ logo.filename }}'
{%- endfor %}

export const LogoNameMapV2 = {
{%- for logo in logos %}
  {% if logo.logoKey contains '-' %}'{{ logo.logoKey }}'{% else %}{{ logo.logoKey }}{% endif %}: {{ logo.componentName }}{%- unless forloop.last %},
{%- endunless %}
{%- endfor %}
}
`

      // Render the template with the data
      const mapFileContent = await engine.parseAndRender(template, templateData)

      // Write the map file
      const mapFilePath = path.join(this.config.OUTPUT_DIR, '..', 'logo-name-map.ts')
      await fs.writeFile(mapFilePath, mapFileContent, 'utf8')

      console.log(`✅ Generated logo map at: ${mapFilePath}`)
    } catch (error) {
      console.error('❌ Error generating logo map:', error.message)
    }
  }

  async ensureDirectoryExists(dir) {
    try {
      await fs.access(dir)
    } catch {
      await fs.mkdir(dir, { recursive: true })
      console.log(`📁 Created directory: ${dir}`)
    }
  }

  async downloadWithConcurrencyLimit(downloadTasks, limit) {
    const results = []

    for (let i = 0; i < downloadTasks.length; i += limit) {
      const batch = downloadTasks.slice(i, i + limit)
      const batchResults = await Promise.allSettled(batch.map(task => task()))
      results.push(...batchResults)

      if (i + limit < downloadTasks.length) {
        console.log(
          `⏳ Completed batch ${Math.floor(i / limit) + 1}/${Math.ceil(downloadTasks.length / limit)}, waiting 1s...`
        )
        await new Promise(resolve => setTimeout(resolve, 1000)) // Rate limiting
      }
    }

    return results
  }

  async downloadAllLogos() {
    try {
      // Validate configuration
      if (!this.config.FIGMA_TOKEN) {
        throw new Error('Please set your FIGMA_TOKEN in the configuration or environment variables')
      }

      if (!this.config.FILE_ID) {
        throw new Error('Please set your FIGMA_FILE_ID in the configuration or environment variables')
      }

      // Get file structure
      const fileData = await this.getFileStructure()

      // console.log('fileData', JSON.stringify(fileData.components, null, 2))
      // console.log('fileData', Object.keys(fileData))

      // Find logos
      console.log(`🔍 Looking for logos in page "${this.config.PAGE_NAME}"...`)
      const logos = this.findLogosInPage(fileData.document, fileData.components, this.config.PAGE_NAME)
      console.log(`✅ Found ${logos.length} logos`)

      if (logos.length === 0) {
        console.log('❌ No logos found. Check your page name and logo structure.')
        return false
      }

      // Ensure output directory exists
      await this.ensureDirectoryExists(this.config.OUTPUT_DIR)

      // Get image URLs
      const nodeIds = logos.map(logo => logo.id)
      const imageData = await this.getImageUrls(nodeIds, this.config.FORMAT, this.config.SCALE)

      if (imageData.err) {
        throw new Error(`Error getting image URLs: ${imageData.err}`)
      }

      // Prepare download tasks
      const downloadTasks = logos.map((logo, index) => {
        return async () => {
          const imageUrl = imageData.images[logo.id]
          if (!imageUrl) {
            console.warn(`⚠️  No URL found for logo: ${logo.name}`)
            return { success: false, logo: logo.name, error: 'No URL' }
          }

          const filename = `${this.sanitizeFilename(logo.name)}.${this.config.FORMAT}`
          const filepath = path.join(this.config.OUTPUT_DIR, filename)

          try {
            await this.downloadFile(imageUrl, filepath, logo.fillColor)
            console.log(`✅ Downloaded ${index + 1}/${logos.length}: ${filename}`)
            return { success: true, logo: logo.name, filename }
          } catch (error) {
            console.error(`❌ Failed to download ${logo.name}: ${error.message}`)
            return { success: false, logo: logo.name, error: error.message }
          }
        }
      })

      // Download with concurrency limit
      console.log(`📥 Starting downloads (${this.config.CONCURRENT_DOWNLOADS} concurrent)...`)
      const results = await this.downloadWithConcurrencyLimit(downloadTasks, this.config.CONCURRENT_DOWNLOADS)

      // Summary
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      const failed = results.length - successful

      console.log(`\n🎉 Download complete!`)

      // Display results in table format
      console.table({
        'Logo Status': {
          'Successfully Downloaded': `${successful} logos`,
          'Failed Downloads': failed > 0 ? `${failed} logos` : 0,
          'Output Directory': path.resolve(this.config.OUTPUT_DIR)
        }
      })

      // Generate logo-name-map.ts file
      await this.generateLogoNameMap(results)

      return true
    } catch (error) {
      console.error('💥 Error downloading logos:', error.message)
    }
  }
}

/**
 * Download logos from Figma
 * @param {Object} customConfig - Optional custom configuration that overrides default config
 * @returns {Promise<boolean>} - Returns true if successful
 */
async function downloadLogos() {
  try {
    const downloader = new FigmaLogoDownloader(DEFAULT_CONFIG)
    return await downloader.downloadAllLogos()
  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Execute logos download
await downloadLogos()
