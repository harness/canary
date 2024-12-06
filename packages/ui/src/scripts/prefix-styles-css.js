/**
 * This script prefixes css variables in tailwind "styles.css" with a prefix "canary"
 * For e.g., "--background" gets updated to "--canary-background"
 */

const fs = require('fs')
const path = require('path')

// Input and output file paths
const inputFilePath = path.resolve(__dirname, 'styles.css') // Replace with your file path
const outputFilePath = path.resolve(__dirname, 'styles-canary.css')

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }

  // Regex to find CSS variables and prefix them
  const updatedData = data.replace(/(--)([a-zA-Z0-9-]+)/g, '$1canary-$2')

  fs.writeFile(outputFilePath, updatedData, 'utf8', err => {
    if (err) {
      console.error('Error writing file:', err)
      return
    }

    console.log('File processed successfully. Updated file saved at:', outputFilePath)
  })
})
