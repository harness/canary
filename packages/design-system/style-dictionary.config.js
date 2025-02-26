// const transformers = {
//   ['shadow/css']: {
//     type: 'value',
//     matcher: function (token) {
//       return token.$type === 'boxShadow'
//     },
//     transformer: function (token) {
//       const transformShadow = shadow => {
//         const { x, y, blur, spread, color, type } = shadow
//         return `${type === 'innerShadow' ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`
//       }

//       if (Array.isArray(token.$value)) {
//         return token.$value.map(transformShadow).join(', ')
//       } else {
//         return transformShadow(token.$value)
//       }
//     }
//   }
// }

/**
 * Style Dictionary Config for W3C Design Tokens
 *
 * This configuration file handles the conversion of W3C Design Tokens to CSS variables,
 * with special handling for shadow values.
 */

// Create a simplified configuration that works with Style Dictionary v4
module.exports = {
  source: ['primitives/**/*.json', 'theme/**/*.json', 'components/**/*.json', 'breakpoint/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'canary-',
      buildPath: 'dist/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            showFileHeader: true
          }
        }
      ]
    }
  }
  // Add a custom action to process the shadow values after the build
  // action: {
  //   postBuild: {
  //     fix_shadows: (dictionary, config) => {
  //       const fs = require('fs');
  //       const path = require('path');

  //       // Process each platform
  //       Object.keys(config.platforms).forEach(platform => {
  //         const platformConfig = config.platforms[platform];

  //         // Process each file
  //         platformConfig.files.forEach(file => {
  //           const filePath = path.join(platformConfig.buildPath, file.destination);

  //           // Read the generated file
  //           let cssContent = fs.readFileSync(filePath, 'utf8');

  //           // Find and replace [object Object] with proper shadow values
  //           dictionary.allTokens
  //             .filter(token => token.type === 'boxShadow')
  //             .forEach(token => {
  //               const tokenName = `--${platformConfig.prefix}${token.name}`;
  //               const objectRegex = new RegExp(`${tokenName}: \\[object Object\\](,\\s*\\[object Object\\])*;`, 'g');

  //               let shadowValue = '';
  //               if (Array.isArray(token.value)) {
  //                 shadowValue = token.value.map(shadow => {
  //                   return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
  //                 }).join(', ');
  //               } else if (token.value && typeof token.value === 'object') {
  //                 shadowValue = `${token.value.x}px ${token.value.y}px ${token.value.blur}px ${token.value.spread}px ${token.value.color}`;
  //               }

  //               // Replace the [object Object] with the proper shadow value
  //               cssContent = cssContent.replace(objectRegex, `${tokenName}: ${shadowValue};`);
  //             });

  //           // Write the updated content back to the file
  //           fs.writeFileSync(filePath, cssContent);
  //           console.log(`✅ Fixed shadow values in ${filePath}`);
  //         });
  //       });
  //     }
  //   }
  // }
}
