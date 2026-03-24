const fs = require('fs');
const path = require('path');

const jsDir = path.join(process.cwd(), 'src', 'js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

files.forEach(f => {
    fs.renameSync(path.join(jsDir, f), path.join(jsDir, f.replace('.js', '.ts')));
});

fs.renameSync(path.join(process.cwd(), 'main.js'), path.join(process.cwd(), 'main.ts'));

let html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
html = html.replace('<script type="module" src="/main.js"></script>', '<script type="module" src="/main.ts"></script>');
fs.writeFileSync(path.join(process.cwd(), 'index.html'), html);

// Also we need tsconfig.json
const tsconfig = {
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "strict": false,
        "noUnusedLocals": false,
        "noUnusedParameters": false,
        "noFallfallCasesInSwitch": true
    },
    "include": ["src/**/*.ts", "main.ts"]
};
fs.writeFileSync(path.join(process.cwd(), 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

console.log("Migrated to TS");
