import fs from 'fs/promises';

// Mapping of current theme names to new groups and unique theme names
const themeMapping = {
  // Standard collection
  'dark': { group: 'standard', name: 'standard-dark', file: 'mode/dark/default' },
  'light': { group: 'standard', name: 'standard-light', file: 'mode/light/default' },
  
  // High contrast collection
  'dark-high-contrast': { group: 'high-contrast', name: 'high-contrast-dark', file: 'mode/dark/high-contrast' },
  'light-high-contrast': { group: 'high-contrast', name: 'high-contrast-light', file: 'mode/light/high-contrast' },
  
  // Low contrast collection
  'dark-dimmer': { group: 'low-contrast', name: 'low-contrast-dark', file: 'mode/dark/dimmer' },
  'light-dimmer': { group: 'low-contrast', name: 'low-contrast-light', file: 'mode/light/dimmer' },
  
  // Standard protanopia collection
  'dark-protanopia': { group: 'standard-protanopia', name: 'standard-protanopia-dark', file: 'mode/dark/default-protanopia' },
  'light-protanopia': { group: 'standard-protanopia', name: 'standard-protanopia-light', file: 'mode/light/default-protanopia' },
  
  // High contrast protanopia collection
  'dark-high-contrast-protanopia': { group: 'high-contrast-protanopia', name: 'high-contrast-protanopia-dark', file: 'mode/dark/high-contrast-protanopia' },
  'light-high-contrast-protanopia': { group: 'high-contrast-protanopia', name: 'high-contrast-protanopia-light', file: 'mode/light/high-contrast-protanopia' },
  
  // Low contrast protanopia collection
  'dark-dimmer-protanopia': { group: 'low-contrast-protanopia', name: 'low-contrast-protanopia-dark', file: 'mode/dark/dimmer-protanopia' },
  'light-dimmer-protanopia': { group: 'low-contrast-protanopia', name: 'low-contrast-protanopia-light', file: 'mode/light/dimmer-protanopia' },
  
  // Standard deuteranopia collection
  'dark-deuteranopia': { group: 'standard-deuteranopia', name: 'standard-deuteranopia-dark', file: 'mode/dark/default-deuteranopia' },
  'light-deuteranopia': { group: 'standard-deuteranopia', name: 'standard-deuteranopia-light', file: 'mode/light/default-deuteranopia' },
  
  // High contrast deuteranopia collection
  'dark-high-contrast-deuteranopia': { group: 'high-contrast-deuteranopia', name: 'high-contrast-deuteranopia-dark', file: 'mode/dark/high-contrast-deuteranopia' },
  'light-high-contrast-deuteranopia': { group: 'high-contrast-deuteranopia', name: 'high-contrast-deuteranopia-light', file: 'mode/light/high-contrast-deuteranopia' },
  
  // Low contrast deuteranopia collection
  'dark-dimmer-deuteranopia': { group: 'low-contrast-deuteranopia', name: 'low-contrast-deuteranopia-dark', file: 'mode/dark/dimmer-deuteranopia' },
  'light-dimmer-deuteranopia': { group: 'low-contrast-deuteranopia', name: 'low-contrast-deuteranopia-light', file: 'mode/light/dimmer-deuteranopia' },
  
  // Standard tritanopia collection
  'dark-tritanopia': { group: 'standard-tritanopia', name: 'standard-tritanopia-dark', file: 'mode/dark/default-tritanopia' },
  'light-tritanopia': { group: 'standard-tritanopia', name: 'standard-tritanopia-light', file: 'mode/light/default-tritanopia' },
  
  // High contrast tritanopia collection
  'dark-high-contrast-tritanopia': { group: 'high-contrast-tritanopia', name: 'high-contrast-tritanopia-dark', file: 'mode/dark/high-contrast-tritanopia' },
  'light-high-contrast-tritanopia': { group: 'high-contrast-tritanopia', name: 'high-contrast-tritanopia-light', file: 'mode/light/high-contrast-tritanopia' },
  
  // Low contrast tritanopia collection
  'dark-dimmer-tritanopia': { group: 'low-contrast-tritanopia', name: 'low-contrast-tritanopia-dark', file: 'mode/dark/dimmer-tritanopia' },
  'light-dimmer-tritanopia': { group: 'low-contrast-tritanopia', name: 'low-contrast-tritanopia-light', file: 'mode/light/dimmer-tritanopia' }
};

async function rebuildThemes() {
  try {
    // Read current $themes.json
    const themesData = JSON.parse(await fs.readFile('design-tokens/$themes.json', 'utf8'));
    
    // Process each theme
    const processedThemes = themesData.map(theme => {
      // Skip the source theme (keep it as is)
      if (theme.name === 'source' || theme.name === 'desktop') {
        return theme;
      }
      
      // Get mapping for current theme name
      const mapping = themeMapping[theme.name];
      
      if (!mapping) {
        console.warn(`No mapping found for theme: ${theme.name}`);
        return theme;
      }
      
      // Create new theme object with updated structure
      const newTheme = {
        ...theme,
        name: mapping.name, // Use unique name like 'standard-dark'
        group: mapping.group, // Set new group
        selectedTokenSets: {
          [mapping.file]: 'enabled',
          'mode/dark/icon-stroke-width': 'enabled' // Keep icon stroke width
        }
      };
      
      // Update icon stroke width based on mode
      if (mapping.name.includes('light')) {
        newTheme.selectedTokenSets['mode/light/icon-stroke-width'] = 'enabled';
        delete newTheme.selectedTokenSets['mode/dark/icon-stroke-width'];
      }
      
      console.log(`Processed: ${theme.name} -> ${mapping.group}/${mapping.name}`);
      
      return newTheme;
    });
    
    // Write updated themes back to file
    await fs.writeFile('design-tokens/$themes.json', JSON.stringify(processedThemes, null, 2));
    
    console.log('✅ Successfully rebuilt $themes.json');
    console.log(`Processed ${processedThemes.length - 2} themes (excluding source and desktop)`);
    
  } catch (error) {
    console.error('❌ Error rebuilding themes:', error);
    process.exit(1);
  }
}

// Run the rebuild
rebuildThemes();
