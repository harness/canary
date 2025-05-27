import { createWriteStream, promises as fs } from 'fs'
import https from 'https'
import path from 'path'
import { URL } from 'url'

import { config as dotenvConfig } from 'dotenv'

// Load environment variables from .env file
dotenvConfig()

// Default configuration - Can be overridden when importing
const DEFAULT_CONFIG = {
  FIGMA_TOKEN: process.env.FIGMA_TOKEN,
  FILE_ID: process.env.FIGMA_FILE_ID,
  PAGE_NAME: process.env.FIGMA_PAGE_NAME || 'icons-to-dev',
  OUTPUT_DIR: process.env.OUTPUT_DIR || './src/components/icon-v2/icons',
  FORMAT: process.env.ICON_FORMAT || 'svg', // 'svg', 'png', 'jpg', 'pdf'
  SCALE: parseInt(process.env.ICON_SCALE) || 1, // Only for raster formats
  CONCURRENT_DOWNLOADS: parseInt(process.env.CONCURRENT_DOWNLOADS) || 5
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
      const parsedUrl = new URL(url)
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
    // Replace fill colors with currentColor
    let processed = svgContent.replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="currentColor"')
    processed = processed.replace(/fill="rgb\([^)]+\)"/g, 'fill="currentColor"')
    processed = processed.replace(/fill="[a-zA-Z]+"/g, match => {
      // Don't replace 'fill="none"' as it's often needed for proper rendering
      if (match === 'fill="none"') return match
      return 'fill="currentColor"'
    })

    // Replace stroke colors with currentColor
    processed = processed.replace(/stroke="#[0-9A-Fa-f]{3,8}"/g, 'stroke="currentColor"')
    processed = processed.replace(/stroke="rgb\([^)]+\)"/g, 'stroke="currentColor"')
    processed = processed.replace(/stroke="[a-zA-Z]+"/g, match => {
      // Don't replace 'stroke="none"' as it's often needed for proper rendering
      if (match === 'stroke="none"') return match
      return 'stroke="currentColor"'
    })

    // Also handle style attributes that might contain fill or stroke
    processed = processed.replace(
      /style="([^"]*)(fill|stroke)\s*:\s*([^;"]+)([^"]*)"/g,
      (match, prefix, property, value, suffix) => {
        // Don't replace 'none' values
        if (value.trim() === 'none') {
          return match
        }
        return `style="${prefix}${property}:currentColor${suffix}"`
      }
    )

    // Remove width and height attributes from the root SVG element
    // We keep the viewBox to maintain the correct aspect ratio
    // We need multiple passes to handle both attributes
    processed = processed.replace(/<svg([^>]*)\swidth="[^"]*"([^>]*)>/g, '<svg$1$2>')
    processed = processed.replace(/<svg([^>]*)\sheight="[^"]*"([^>]*)>/g, '<svg$1$2>')

    return processed
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

      // Create imports and map entries
      const imports = []
      const mapEntries = []

      for (const download of successfulDownloads) {
        const filename = download.filename
        const componentName = this.toComponentName(filename)
        const iconKey = this.toIconKey(filename)

        // Create relative path using './' since the map will be in the same directory
        imports.push(`import ${componentName} from './${filename}'`)
        mapEntries.push(`  '${iconKey}': ${componentName}`)
      }

      // Generate the TypeScript file content
      const mapFileContent = `import * as React from 'react'

${imports.join('\n')}

export const IconNameMapV2 = {
${mapEntries.join(',\n')}
} satisfies Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>>
`

      // Write the map file
      const mapFilePath = path.join(this.config.OUTPUT_DIR, 'icon-name-map.ts')
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
      if (!this.config.FIGMA_TOKEN || this.config.FIGMA_TOKEN === 'your-figma-personal-access-token') {
        throw new Error('Please set your FIGMA_TOKEN in the configuration or environment variables')
      }

      if (!this.config.FILE_ID || this.config.FILE_ID === 'your-figma-file-id') {
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
      console.log(`✅ Successfully downloaded: ${successful} icons`)
      if (failed > 0) {
        console.log(`❌ Failed downloads: ${failed} icons`)
      }
      console.log(`📁 Icons saved to: ${path.resolve(this.config.OUTPUT_DIR)}`)

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
async function downloadIcons(customConfig) {
  try {
    const config = customConfig || DEFAULT_CONFIG
    const downloader = new FigmaIconDownloader(config)
    return await downloader.downloadAllIcons()
  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Execute icons download
await downloadIcons()
