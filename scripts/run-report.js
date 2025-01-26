// Basic Node.js script to run our report generator
const { spawn } = require('child_process');
const path = require('path');

const reportScript = path.join(__dirname, 'generate-report.ts');

const proc = spawn('npx', ['ts-node', reportScript], { stdio: 'inherit' });

proc.on('error', (err) => {
    console.error('Failed to start report generator:', err);
});

proc.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Report generator exited with code ${code}`);
    }
});