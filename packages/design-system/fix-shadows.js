/**
 * Script to fix shadow values in the generated CSS file
 * 
 * This script reads the shadow token definitions from the original JSON files
 * and replaces the [object Object] values in the generated CSS with proper
 * CSS box-shadow values.
 */
const fs = require('fs');
const path = require('path');

// Path to the generated CSS file
const cssFilePath = path.resolve(__dirname, 'dist/variables.css');

// Read the CSS file
let cssContent = fs.readFileSync(cssFilePath, 'utf8');

// Function to read a JSON file
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

// Function to resolve token references (e.g., {colors.pure.black})
function resolveTokenReference(reference, tokens) {
  if (!reference.startsWith('{') || !reference.endsWith('}')) {
    return reference;
  }
  
  const path = reference.slice(1, -1).split('.');
  let value = tokens;
  
  for (const key of path) {
    if (!value[key]) {
      console.warn(`Could not resolve reference ${reference}`);
      return reference;
    }
    value = value[key];
  }
  
  if (value.$value) {
    if (typeof value.$value === 'string' && value.$value.startsWith('{')) {
      return resolveTokenReference(value.$value, tokens);
    }
    return value.$value;
  }
  
  return reference;
}

// Load all token files
const tokenFiles = {
  'primitives': {},
  'theme': {},
  'components': {},
  'breakpoint': {}
};

// Read all token files
Object.keys(tokenFiles).forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dir, file);
        const content = readJsonFile(filePath);
        if (content) {
          tokenFiles[dir][file.replace('.json', '')] = content;
        }
      }
    });
  }
});

// Combine all tokens into a single object for reference resolution
const allTokens = {};
Object.values(tokenFiles).forEach(dirTokens => {
  Object.values(dirTokens).forEach(fileTokens => {
    Object.assign(allTokens, fileTokens);
  });
});

// Find all shadow variables in the CSS file
const shadowRegex = /--canary-shadow-[^:]+:\s*\[object Object\](?:,\s*\[object Object\])*;/g;
const matches = cssContent.match(shadowRegex);

if (matches) {
  console.log(`Found ${matches.length} shadow variables to fix`);
  
  // Process each shadow variable
  matches.forEach(match => {
    // Extract the variable name
    const varName = match.split(':')[0].trim();
    
    // Get the token name without the prefix
    const tokenName = varName.replace('--canary-', '');
    const tokenPath = tokenName.split('-');
    
    // Find the shadow token in the theme files
    let shadowToken = null;
    let shadowValue = '';
    
    // Look for the token in theme files first
    if (tokenFiles.theme.dark && tokenFiles.theme.dark.shadow) {
      const shadowKey = tokenPath[tokenPath.length - 1];
      shadowToken = tokenFiles.theme.dark.shadow[shadowKey];
    }
    
    if (shadowToken && shadowToken.$value) {
      // Process the shadow value
      if (Array.isArray(shadowToken.$value)) {
        // Handle array of shadows
        shadowValue = shadowToken.$value.map(shadow => {
          const color = resolveTokenReference(shadow.color, allTokens);
          return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${color}`;
        }).join(', ');
      } else if (typeof shadowToken.$value === 'object') {
        // Handle single shadow
        const shadow = shadowToken.$value;
        const color = resolveTokenReference(shadow.color, allTokens);
        
        // Check if it's an inner shadow
        const isInner = shadow.type === 'innerShadow';
        const innerPrefix = isInner ? 'inset ' : '';
        
        shadowValue = `${innerPrefix}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${color}`;
      }
    } else {
      // Fallback to hardcoded values if token not found
      switch (tokenName) {
        case 'shadow-0':
          shadowValue = '0px 0px 0px 0px var(--canary-shadow-color-0)';
          break;
        case 'shadow-1':
          shadowValue = '0px 1px 2px 0px var(--canary-shadow-color-1)';
          break;
        case 'shadow-2':
          shadowValue = '0px 2px 4px 0px var(--canary-shadow-color-2), 0px 0px 1px 0px var(--canary-shadow-color-2)';
          break;
        case 'shadow-3':
          shadowValue = '0px 4px 8px 0px var(--canary-shadow-color-3), 0px 0px 1px 0px var(--canary-shadow-color-3)';
          break;
        case 'shadow-4':
          shadowValue = '0px 8px 16px 0px var(--canary-shadow-color-4), 0px 0px 1px 0px var(--canary-shadow-color-4)';
          break;
        case 'shadow-5':
          shadowValue = '0px 16px 24px 0px var(--canary-shadow-color-5), 0px 0px 1px 0px var(--canary-shadow-color-5)';
          break;
        case 'shadow-6':
          shadowValue = '0px 24px 32px 0px var(--canary-shadow-color-6)';
          break;
        case 'shadow-inner':
          shadowValue = 'inset 0px 1px 2px 0px var(--canary-shadow-color-inner)';
          break;
        default:
          // For component-specific shadows, use a generic value
          shadowValue = '0px 2px 4px 0px rgba(0, 0, 0, 0.2)';
      }
    }
    
    // Replace the [object Object] with the proper shadow value
    cssContent = cssContent.replace(match, `${varName}: ${shadowValue};`);
  });
  
  // Write the updated content back to the file
  fs.writeFileSync(cssFilePath, cssContent);
  console.log(`✅ Fixed shadow values in ${cssFilePath}`);
} else {
  console.log('No shadow variables found to fix');
}
