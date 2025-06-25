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
  PAGE_NAME: process.env.FIGMA_PAGE_NAME,
  OUTPUT_DIR: './src/components/icon-v2/icons',
  FORMAT: 'svg', // 'svg', 'png', 'jpg', 'pdf'
  SCALE: 1, // Only for raster formats
  CONCURRENT_DOWNLOADS: 10
}

class FigmaIconDownloader {
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
    console.log(`🔗 Getting image URLs for ${nodeIds.length} icons...`)
    return this.makeRequest(endpoint)
  }

  findIconsInPage(document, pageName) {
    const page = document.children.find(child => child.name === pageName)
    if (!page) {
      throw new Error(`Page "${pageName}" not found. Available pages: ${document.children.map(p => p.name).join(', ')}`)
    }

    const icons = []

    function traverseNode(node, depth = 0) {
      // Only component type needs to be downloaded
      if (node.type === 'COMPONENT') {
        // Skip nested icons to avoid duplicates (only take top-level icons)
        if (depth <= 2) {
          icons.push({
            id: node.id,
            name: node.name,
            type: node.type
          })
        }
      }

      // Recursively check children, but limit depth to avoid deep nesting
      if (node.children && depth < 3) {
        node.children.forEach(child => traverseNode(child, depth + 1))
      }
    }

    page.children.forEach(child => traverseNode(child, 0))
    return icons
  }

  async downloadFile(url, filepath) {
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
                  const processedSvg = this.processSvgForTheming(svgData)

                  // Write the processed SVG to file
                  await fs.writeFile(filepath, processedSvg, 'utf8')
                  resolve(true)
                } catch (error) {
                  reject(error)
                }
              })
            } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              // Handle redirects
              this.downloadFile(res.headers.location, filepath).then(resolve).catch(reject)
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
              console.log('res.headers.location', res.headers.location)

              // Handle redirects
              this.downloadFile(res.headers.location, filepath).then(resolve).catch(reject)
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
            }
          })
          .on('error', reject)
      }
    })
  }

  processSvgForTheming(svgContent) {
    try {
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
          // Custom plugin to replace fill/stroke with currentColor
          {
            name: 'themify',
            type: 'visitor',
            fn: () => {
              return {
                element: {
                  enter: node => {
                    // Process style attribute
                    if (node.attributes.style) {
                      const styleAttr = node.attributes.style
                      // Replace fill and stroke color values with currentColor
                      node.attributes.style = styleAttr.replace(
                        /(fill|stroke)\s*:\s*([^;]+)/g,
                        (match, prop, value) => {
                          if (value.trim() === 'none') {
                            return match
                          }
                          return `${prop}:currentColor`
                        }
                      )
                    }

                    // Process fill attribute
                    if (node.attributes.fill && node.attributes.fill !== 'none') {
                      node.attributes.fill = 'currentColor'
                    }

                    // Process stroke attribute
                    if (node.attributes.stroke && node.attributes.stroke !== 'none') {
                      node.attributes.stroke = 'currentColor'
                    }
                  }
                }
              }
            }
          }
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

  // Convert a filename to a kebab-case key for the icon map
  toIconKey(filename) {
    // Remove extension and ensure kebab-case
    return filename.replace(/\.svg$/, '').toLowerCase()
  }

  /**
   * Generate an icon-name-map.ts file with all successfully downloaded icons
   * @param {Array} results - Download results from downloadAllIcons
   * @returns {Promise<void>}
   */
  async generateIconNameMap(results) {
    try {
      // Filter for successful downloads
      const successfulDownloads = results
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .map(r => r.value)
        .sort((a, b) => a.filename.localeCompare(b.filename))

      if (successfulDownloads.length === 0) {
        console.log('⚠️ No successful downloads, skipping icon map generation')
        return
      }

      // Data for the LiquidJS template
      const templateData = {
        icons: successfulDownloads.map(download => ({
          filename: download.filename,
          componentName: this.toComponentName(download.filename),
          iconKey: this.toIconKey(download.filename)
        }))
      }

      // File template
      const template = `/**
 * Harness Design System
 * Generated icon map - DO NOT EDIT DIRECTLY
 */
{% for icon in icons %}
import {{ icon.componentName }} from './icons/{{ icon.filename }}'
{%- endfor %}

export const IconNameMapV2 = {
{%- for icon in icons %}
  {% if icon.iconKey contains '-' %}'{{ icon.iconKey }}'{% else %}{{ icon.iconKey }}{% endif %}: {{ icon.componentName }}{%- unless forloop.last %},
{%- endunless %}
{%- endfor %}
}
`

      // Render the template with the data
      const mapFileContent = await engine.parseAndRender(template, templateData)

      // Write the map file
      const mapFilePath = path.join(this.config.OUTPUT_DIR, '..', 'icon-name-map.ts')
      await fs.writeFile(mapFilePath, mapFileContent, 'utf8')

      console.log(`✅ Generated icon map at: ${mapFilePath}`)
    } catch (error) {
      console.error('❌ Error generating icon map:', error.message)
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

  async downloadAllIcons() {
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

      // Find icons
      console.log(`🔍 Looking for icons in page "${this.config.PAGE_NAME}"...`)
      const icons = this.findIconsInPage(fileData.document, this.config.PAGE_NAME)
      console.log(`✅ Found ${icons.length} icons`)

      if (icons.length === 0) {
        console.log('❌ No icons found. Check your page name and icon structure.')
        return false
      }

      // Ensure output directory exists
      await this.ensureDirectoryExists(this.config.OUTPUT_DIR)

      // Get image URLs
      const nodeIds = icons.map(icon => icon.id)
      const imageData = await this.getImageUrls(nodeIds, this.config.FORMAT, this.config.SCALE)

      if (imageData.err) {
        throw new Error(`Error getting image URLs: ${imageData.err}`)
      }

      // Prepare download tasks
      const downloadTasks = icons.map((icon, index) => {
        return async () => {
          const imageUrl = imageData.images[icon.id]
          if (!imageUrl) {
            console.warn(`⚠️  No URL found for icon: ${icon.name}`)
            return { success: false, icon: icon.name, error: 'No URL' }
          }

          const filename = `${this.sanitizeFilename(icon.name)}.${this.config.FORMAT}`
          const filepath = path.join(this.config.OUTPUT_DIR, filename)

          try {
            await this.downloadFile(imageUrl, filepath)
            console.log(`✅ Downloaded ${index + 1}/${icons.length}: ${filename}`)
            return { success: true, icon: icon.name, filename }
          } catch (error) {
            console.error(`❌ Failed to download ${icon.name}: ${error.message}`)
            return { success: false, icon: icon.name, error: error.message }
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
        'Icon Status': {
          'Successfully Downloaded': `${successful} icons`,
          'Failed Downloads': failed > 0 ? `${failed} icons` : 0,
          'Output Directory': path.resolve(this.config.OUTPUT_DIR)
        }
      })

      // Generate icon-name-map.ts file
      await this.generateIconNameMap(results)

      return true
    } catch (error) {
      console.error('💥 Error downloading icons:', error.message)
    }
  }
}

/**
 * Download icons from Figma
 * @param {Object} customConfig - Optional custom configuration that overrides default config
 * @returns {Promise<boolean>} - Returns true if successful
 */
async function downloadIcons() {
  try {
    const downloader = new FigmaIconDownloader(DEFAULT_CONFIG)
    return await downloader.downloadAllIcons()
  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Execute icons download
await downloadIcons()
