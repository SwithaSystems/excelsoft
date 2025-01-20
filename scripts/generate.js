#!/usr/bin/env node

/**
 * Script to generate a React Native component folder with a functional component and a stylesheet.
 * First updates the containers object, then adds the component to the Stack routes.
 * Usage: node createComponent.js <foldername>
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appDir = path.join(root, "app");
const containersDir = path.join(root, "containers");
const layoutFilePath = path.join(appDir, "_layout.js");

const folderName = process.argv[2];

if (!folderName) {
  console.error("❌ Please provide a folder name. Usage: node createComponent.js <foldername>");
  process.exit(1);
}

const folderPath = path.join(appDir, folderName);
const componentFileName = `${folderName}.tsx`;
const stylesFileName = `${folderName}Styles.ts`;
const containersFilePath = path.join(containersDir, "index.ts");

const componentContent = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './${folderName}Styles';

const ${folderName} = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${folderName} Component</Text>
    </View>
  );
};

export default ${folderName};
`;

const stylesContent = `import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 12,
    color: 'black',
  }
});

export default styles;
`;

const updateContainers = async () => {
  try {
    // Ensure the containers folder exists
    await fs.promises.mkdir(containersDir, { recursive: true });

    // Initialize or update the containers/index.ts file
    let containersContent = "";
    if (fs.existsSync(containersFilePath)) {
      containersContent = await fs.promises.readFile(containersFilePath, "utf-8");
    }

    const screenKey = `${folderName}Screen`;
    const exportLine = `${screenKey}: '${folderName}/${folderName}'`;
    
    if (!containersContent.includes(exportLine)) {
      const exportObjectRegex = /export\s+default\s+{([\s\S]*?)}/;
      const match = containersContent.match(exportObjectRegex);
      
      let newContent;
      if (match) {
        newContent = containersContent.replace(
          exportObjectRegex,
          `export default {${match[1].trim()}, ${exportLine}}`
        );
      } else {
        newContent = `export default {\n  ${exportLine}\n};\n`;
      }
      
      await fs.promises.writeFile(containersFilePath, newContent);
      console.log(`📄 Updated containers/index.ts with '${exportLine}'.`);
    } else {
      console.log(`ℹ️ '${exportLine}' already exists in containers/index.ts.`);
    }
    
    return screenKey; // Return the screen key for use in layout file
  } catch (error) {
    console.error(`❌ Error updating containers: ${error.message}`);
    throw error;
  }
};

const updateLayout = async (screenKey) => {
  try {
    if (fs.existsSync(layoutFilePath)) {
      let layoutContent = await fs.promises.readFile(layoutFilePath, "utf-8");

      // Add import statement if not exists
      const importStatement = `import containers from '../containers';\n`;
      if (!layoutContent.includes('import containers from')) {
        layoutContent = importStatement + layoutContent;
      }

      const stackScreenEntry = `<Stack.Screen name={containers.${screenKey}} options={{ headerShown: false }} />`;
      if (!layoutContent.includes(stackScreenEntry)) {
        const stackInsertionPoint = layoutContent.lastIndexOf("</Stack>");
        if (stackInsertionPoint !== -1) {
          layoutContent = `${layoutContent.slice(0, stackInsertionPoint)}  ${stackScreenEntry}\n${layoutContent.slice(stackInsertionPoint)}`;
          await fs.promises.writeFile(layoutFilePath, layoutContent);
          console.log(`📄 Updated _layout.js with route for '${screenKey}'.`);
        }
      } else {
        console.log(`ℹ️ Route for '${screenKey}' already exists in _layout.js.`);
      }
    } else {
      console.error("❌ _layout.js file not found.");
    }
  } catch (error) {
    console.error(`❌ Error updating layout: ${error.message}`);
    
    throw error;
  }
};

const createFiles = async () => {
  try {
    // First update containers and get the screen key
    const screenKey = await updateContainers();

    // Create folder
    await fs.promises.mkdir(folderPath, { recursive: true });
    console.log(`📁 Folder '${folderName}' created.`);

    // Create component file
    const componentFilePath = path.join(folderPath, componentFileName);
    await fs.promises.writeFile(componentFilePath, componentContent);
    console.log(`📄 File '${componentFileName}' created.`);

    // Create styles file
    const stylesFilePath = path.join(folderPath, stylesFileName);
    await fs.promises.writeFile(stylesFilePath, stylesContent);
    console.log(`📄 File '${stylesFileName}' created.`);

    // Update layout file with the container reference
    await updateLayout(screenKey);

    console.log(`\n✅ Component '${folderName}' created successfully.`);
  } catch (error) {
    console.error(`❌ Error creating component: ${error.message}`);
  }
};

createFiles();