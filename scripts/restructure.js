#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Structure specific to RadioStationApp with (app) directory pattern
const newStructure = {
    src: {
        assets: {
            images: {},
            icons: {},
            fonts: {}
        },
        components: {
            common: {},
            navigation: {},
            screens: {}
        },
        config: {},
        constants: {},
        navigation: {},
        services: {
            api: {},
            storage: {},
            player: {}
        },
        utils: {},
        types: {}
    },
    // Note: 'app' directory remains in root, not in src
    app: {
        '[tabs]': {},
        _layout: {},
        index: {}
    }
};

// Function to update import paths in a file
function updateImportPaths(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Define import path mappings
    const pathMappings = {
        '../components/': '@/components/',
        './components/': '@/components/',
        'components/': '@/components/',
        '../screens/': '@/screens/',
        './screens/': '@/screens/',
        'screens/': '@/screens/',
        '../assets/': '@/assets/',
        './assets/': '@/assets/',
        'assets/': '@/assets/',
        '../services/': '@/services/',
        './services/': '@/services/',
        'services/': '@/services/',
        '../navigation/': '@/navigation/',
        './navigation/': '@/navigation/',
        'navigation/': '@/navigation/',
        '../constants/': '@/constants/',
        './constants/': '@/constants/',
        'constants/': '@/constants/',
        '../utils/': '@/utils/',
        './utils/': '@/utils/',
        'utils/': '@/utils/',
        '../types/': '@/types/',
        './types/': '@/types/',
        'types/': '@/types/'
    };

    // Update relative imports to use aliases
    Object.entries(pathMappings).forEach(([oldPath, newPath]) => {
        const importRegex = new RegExp(`from ['"](${oldPath}[^'"]+)['"]`, 'g');
        content = content.replace(importRegex, (match, p1) => {
            return `from '${p1.replace(oldPath, newPath)}'`;
        });

        const requireRegex = new RegExp(`require\\(['"](${oldPath}[^'"]+)['"]\\)`, 'g');
        content = content.replace(requireRegex, (match, p1) => {
            return `require('${p1.replace(oldPath, newPath)}')`;
        });
    });

    fs.writeFileSync(filePath, content);
}

// Create directory structure
function createDirectoryStructure(structure, basePath) {
    Object.keys(structure).forEach(dir => {
        const currentPath = path.join(basePath, dir);
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath, { recursive: true });
        }
        if (Object.keys(structure[dir]).length > 0) {
            createDirectoryStructure(structure[dir], currentPath);
        }
    });
}

// Move and update file
function moveAndUpdateFile(sourcePath, destPath) {
    try {
        if (fs.existsSync(sourcePath)) {
            console.log(`Moving ${sourcePath} to ${destPath}`);
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.renameSync(sourcePath, destPath);
            updateImportPaths(destPath);
            console.log(`✓ Successfully moved and updated ${path.basename(sourcePath)}`);
        } else {
            console.log(`⚠️  Source file not found: ${sourcePath}`);
        }
    } catch (error) {
        console.error(`❌ Error moving ${sourcePath}:`, error.message);
    }
}

// Find and move screen components
function moveScreenComponents() {
    // Define screen patterns to look for
    const screenPatterns = [
        { pattern: /About.*\.tsx$/, folder: 'about' },
        { pattern: /Give.*\.tsx$/, folder: 'give' },
        { pattern: /Home.*\.tsx$/, folder: 'home' },
        { pattern: /Live.*\.tsx$/, folder: 'live' },
        { pattern: /Podcast.*\.tsx$/, folder: 'podcasts' },
        { pattern: /Prayer.*\.tsx$/, folder: 'prayer' },
        { pattern: /Show.*\.tsx$/, folder: 'shows' },
        { pattern: /Social.*\.tsx$/, folder: 'social' }
    ];

    // Search in root and common component locations
    const searchDirs = [root, path.join(root, 'components'), path.join(root, 'screens')];
    
    searchDirs.forEach(searchDir => {
        if (fs.existsSync(searchDir)) {
            fs.readdirSync(searchDir).forEach(file => {
                const sourcePath = path.join(searchDir, file);
                
                // Skip if it's a directory
                if (fs.statSync(sourcePath).isDirectory()) return;
                
                // Check if file matches any screen pattern
                screenPatterns.forEach(({ pattern, folder }) => {
                    if (pattern.test(file)) {
                        const destPath = path.join(root, 'src', 'screens', folder, file);
                        moveAndUpdateFile(sourcePath, destPath);
                    }
                });
            });
        } else {
            console.log(`⚠️  Directory not found: ${searchDir}`);
        }
    });
}

// Move and organize assets
function moveAssets() {
    const assetTypes = {
        images: ['.png', '.jpg', '.jpeg', '.gif'],
        icons: ['.svg', '.ico'],
        fonts: ['.ttf', '.otf']
    };

    const assetsDir = path.join(root, 'assets');
    if (fs.existsSync(assetsDir)) {
        fs.readdirSync(assetsDir).forEach(file => {
            const sourcePath = path.join(assetsDir, file);
            if (fs.statSync(sourcePath).isFile()) {
                const ext = path.extname(file).toLowerCase();
                let targetDir = 'images'; // default

                Object.entries(assetTypes).forEach(([type, extensions]) => {
                    if (extensions.includes(ext)) {
                        targetDir = type;
                    }
                });

                const destPath = path.join(root, 'src', 'assets', targetDir, file);
                moveAndUpdateFile(sourcePath, destPath);
            }
        });
    }
}

// Find and move services
function moveServices() {
    // Define service patterns to look for
    const servicePatterns = [
        { pattern: /api.*\.ts$/i, folder: 'api' },
        { pattern: /player.*\.ts$/i, folder: 'player' },
        { pattern: /storage.*\.ts$/i, folder: 'storage' },
        { pattern: /config.*\.ts$/i, folder: 'api' }  // Configuration files go to api folder
    ];

    const servicesDir = path.join(root, 'services');
    const searchDirs = [root, servicesDir];

    searchDirs.forEach(searchDir => {
        if (fs.existsSync(searchDir)) {
            fs.readdirSync(searchDir).forEach(file => {
                const sourcePath = path.join(searchDir, file);
                
                // Skip if it's a directory or not a .ts file
                if (fs.statSync(sourcePath).isDirectory() || !file.endsWith('.ts')) return;
                
                // Check if file matches any service pattern
                servicePatterns.forEach(({ pattern, folder }) => {
                    if (pattern.test(file)) {
                        const destPath = path.join(root, 'src', 'services', folder, file);
                        moveAndUpdateFile(sourcePath, destPath);
                    }
                });
            });
        } else {
            console.log(`⚠️  Directory not found: ${searchDir}`);
        }
    });
}

// Update configuration files
function updateConfigs() {
    // Update tsconfig.json
    const tsconfigPath = path.join(root, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        tsconfig.compilerOptions = {
            ...tsconfig.compilerOptions,
            baseUrl: ".",
            paths: {
                "@/*": ["src/*"],
                "@/components/*": ["src/components/*"],
                "@/screens/*": ["src/screens/*"],
                "@/assets/*": ["src/assets/*"],
                "@/services/*": ["src/services/*"],
                "@/navigation/*": ["src/navigation/*"],
                "@/constants/*": ["src/constants/*"],
                "@/utils/*": ["src/utils/*"],
                "@/types/*": ["src/types/*"]
            }
        };
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }

    // Update babel.config.js
    const babelConfigPath = path.join(root, 'babel.config.js');
    if (fs.existsSync(babelConfigPath)) {
        let babelConfig = fs.readFileSync(babelConfigPath, 'utf8');
        
        if (!babelConfig.includes('module-resolver')) {
            const pluginConfig = `
      ['module-resolver', {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/assets': './src/assets',
          '@/services': './src/services',
          '@/navigation': './src/navigation',
          '@/constants': './src/constants',
          '@/utils': './src/utils',
          '@/types': './src/types'
        }
      }],`;

            babelConfig = babelConfig.replace(
                /(plugins\s*:\s*\[)/,
                `$1${pluginConfig}`
            );
            
            fs.writeFileSync(babelConfigPath, babelConfig);
        }
    }
}

// Find and move components
function moveComponents() {
    const componentPatterns = [
        { pattern: /Navigation.*\.tsx$/i, folder: 'navigation' },
        { pattern: /.*Component\.tsx$/i, folder: 'common' },
        { pattern: /.*Button\.tsx$/i, folder: 'common' },
        { pattern: /.*Modal\.tsx$/i, folder: 'common' },
        { pattern: /.*Card\.tsx$/i, folder: 'common' },
        { pattern: /.*List\.tsx$/i, folder: 'common' }
    ];

    const componentsDir = path.join(root, 'components');
    const searchDirs = [root, componentsDir];

    searchDirs.forEach(searchDir => {
        if (fs.existsSync(searchDir)) {
            fs.readdirSync(searchDir).forEach(file => {
                const sourcePath = path.join(searchDir, file);
                
                // Skip if it's a directory
                if (fs.statSync(sourcePath).isDirectory()) return;
                
                // Check if file matches any component pattern
                componentPatterns.forEach(({ pattern, folder }) => {
                    if (pattern.test(file)) {
                        const destPath = path.join(root, 'src', 'components', folder, file);
                        moveAndUpdateFile(sourcePath, destPath);
                    }
                });
            });
        } else {
            console.log(`⚠️  Directory not found: ${searchDir}`);
        }
    });
}

// Function to recursively search for and move utility files
function moveUtilsAndConstants() {
    const patterns = {
        utils: /.*util.*\.(ts|js)$/i,
        constants: /.*constant.*\.(ts|js)$/i,
        types: /.*\.(type|interface|dto)\.(ts|js)$/i
    };

    function searchAndMove(dir) {
        if (!fs.existsSync(dir)) return;

        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            
            if (fs.statSync(fullPath).isDirectory()) {
                // Skip src directory and node_modules
                if (file !== 'src' && file !== 'node_modules' && file !== '.git') {
                    searchAndMove(fullPath);
                }
            } else {
                // Check each pattern
                if (patterns.utils.test(file)) {
                    moveAndUpdateFile(fullPath, path.join(root, 'src', 'utils', file));
                } else if (patterns.constants.test(file)) {
                    moveAndUpdateFile(fullPath, path.join(root, 'src', 'constants', file));
                } else if (patterns.types.test(file)) {
                    moveAndUpdateFile(fullPath, path.join(root, 'src', 'types', file));
                }
            }
        });
    }

    searchAndMove(root);
}

// Main execution
try {
    console.log('📁 Creating directory structure...');
    createDirectoryStructure(newStructure, root);

    console.log('🚀 Moving and organizing files...');
    console.log('\n📦 Moving screen components...');
    moveScreenComponents();
    console.log('\n🎨 Moving assets...');
    moveAssets();
    console.log('\n🔧 Moving services...');
    moveServices();
    console.log('\n🧩 Moving components...');
    moveComponents();
    console.log('\n📝 Moving utils and constants...');
    moveUtilsAndConstants();

    console.log('⚡ Updating configurations...');
    updateConfigs();

    console.log('\n✨ Project successfully reorganized!');
    console.log('\nNext steps:');
    console.log('1. Install required dependencies:');
    console.log('   npm install --save-dev babel-plugin-module-resolver');
    console.log('2. Update your app directory imports to point to src:');
    console.log('   Example: import MyComponent from "../src/components/MyComponent"');
    console.log('3. Review changes: git status');
    console.log('4. Test the application');
    console.log('5. Commit changes: git commit -am "Reorganize project structure"');
} catch (error) {
    console.error('❌ Error during reorganization:', error);
    process.exit(1);
}