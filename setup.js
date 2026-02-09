#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🎨 Vibe Base Setup');

rl.question('Project name (no spaces, e.g., my-app): ', (name) => {
    const projectName = name.toLowerCase().replace(/\s+/g, '-');

    const filesToUpdate = [
        'package.json',
        'src/config/site.ts',
        '.env.example',
        'README.md'
    ];

    filesToUpdate.forEach(file => {
        if (fs.existsSync(file)) {
            let content = fs.readFileSync(file, 'utf8');
            content = content.replace(/vibe-base/g, projectName);
            fs.writeFileSync(file, content);
        }
    });

    if (fs.existsSync('.git')) {
        fs.rmSync('.git', { recursive: true, force: true });
    }

    console.log(`✅ Project "${projectName}" ready!`);
    console.log(`Next steps:\n  npm install\n  cp .env.example .env.local\n  npm run dev`);
    rl.close();
});
