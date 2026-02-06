const { exec } = require('child_process');
const readline = require('readline');
const path = require('path');

const PROJECTS = {
    1: {
        name: 'Frontend',
        folder: 'vectormagazine-frontend',
        command: 'npm run dev',
        port: 3000
    },
    2: {
        name: 'Backend (Flask)',
        folder: 'vectormagazine-backend',
        command: 'venv\\Scripts\\python -m flask run',
        port: 5000
    },
    3: {
        name: 'Admin',
        folder: 'vectormagazine-admin',
        command: 'npm run dev -- -p 3001',
        port: 3001
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayMenu() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     VECTOR MAGAZINE - Project Launcher  ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║  1. Frontend      (localhost:3000)      ║');
    console.log('║  2. Backend       (localhost:5000)      ║');
    console.log('║  3. Admin         (localhost:3001)      ║');
    console.log('║  4. Start ALL                           ║');
    console.log('║  0. Exit                                ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('\nEnter numbers separated by comma (e.g., 1,2) or 4 for all:');
}

function startProject(project) {
    const projectPath = path.join(__dirname, project.folder);
    const cmdCommand = `start "${project.name}" cmd /k "cd /d ${projectPath} && ${project.command}"`;

    exec(cmdCommand, { shell: 'cmd.exe' }, (error) => {
        if (error) {
            console.error(`Error starting ${project.name}:`, error.message);
        } else {
            console.log(`✓ ${project.name} started on port ${project.port}`);
        }
    });
}

function handleInput(input) {
    const trimmed = input.trim();

    if (trimmed === '0') {
        console.log('Goodbye!');
        rl.close();
        return;
    }

    if (trimmed === '4') {
        // Start all projects
        console.log('\nStarting all projects...\n');
        Object.values(PROJECTS).forEach(project => startProject(project));
        setTimeout(() => {
            console.log('\nAll projects launched! Press Ctrl+C to close this menu.');
            promptAgain();
        }, 1000);
        return;
    }

    const selections = trimmed.split(',').map(s => parseInt(s.trim()));
    const validSelections = selections.filter(s => PROJECTS[s]);

    if (validSelections.length === 0) {
        console.log('Invalid selection. Please try again.');
        promptAgain();
        return;
    }

    console.log('\nStarting selected projects...\n');
    validSelections.forEach(selection => {
        startProject(PROJECTS[selection]);
    });

    setTimeout(() => {
        console.log('\nSelected projects launched!');
        promptAgain();
    }, 1000);
}

function promptAgain() {
    rl.question('\nSelect more projects or 0 to exit: ', handleInput);
}

// Main
displayMenu();
rl.question('> ', handleInput);
