/**
 * This script prefixes css variables in tailwind "tailwind.ts" with a prefix "canary"
 * For e.g., "--background" gets updated to "--canary-background"
 */

import { readFileSync, writeFileSync } from 'fs'

// Function to add a prefix to CSS variables
function addPrefixToCssVariables(inputPath, outputPath, prefix = 'canary') {
  // Read the content of the input file
  const content = readFileSync(inputPath, 'utf8')

  // Use a regex to find and replace CSS variables with the prefix
  const updatedContent = content.replace(/--([a-zA-Z0-9-]+)/g, `--${prefix}-$1`)

  // Write the updated content to the output file
  writeFileSync(outputPath, updatedContent, 'utf8')

  console.log(`Updated file saved to: ${outputPath}`)
}

// Example usage
const inputFile = 'tailwind.ts' // Replace with your input file path
const outputFile = 'tailwind_prefixed.ts' // Replace with your output file path
addPrefixToCssVariables(inputFile, outputFile)
