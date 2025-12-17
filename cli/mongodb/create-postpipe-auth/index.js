#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log(chalk.bold.blue('\nWelcome to PostPipe Auth Setup!\n'));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'database',
            message: 'Choose your database:',
            choices: [
                { name: '1. MongoDB', value: 'mongodb' },
                { name: '2. (coming soon)', value: 'coming_soon_1', disabled: true },
            ],
        },
    ]);

    if (answers.database === 'mongodb') {
        await setupMongoDB();
    } else {
        console.log('Selection not supported yet.');
    }
}

async function setupMongoDB() {
    const spinner = ora('Initializing MongoDB Authentication...').start();

    try {
        const targetDir = process.cwd();
        const templateDir = path.join(__dirname, 'templates', 'mongodb');

        // 1. Copy Template Files
        // Helper to check if src exists
        const isSrc = fs.existsSync(path.join(targetDir, 'src'));
        // Copy directly to standard Next.js folders (lib, models, app)
        const destDir = isSrc ? path.join(targetDir, 'src') : targetDir;

        spinner.text = `Copying templates to ${destDir}...`;
        await fs.copy(templateDir, destDir);

        // 2. Install Dependencies
        spinner.text = 'Installing dependencies...';
        await execa('npm', ['install', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'postpipe', 'zod', 'resend'], { cwd: targetDir });
        await execa('npm', ['install', '-D', '@types/bcryptjs', '@types/jsonwebtoken'], { cwd: targetDir });

        // 3. Create .env with placeholders
        spinner.text = 'Configuring environment...';
        const envPath = path.join(targetDir, '.env');
        const envContent = `
# PostPipe Auth Configuration
DATABASE_URI=your_mongodb_connection_string
JWT_SECRET=your_super_complex_secret
RESEND_API_KEY=optional_resend_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
    `;

        if (fs.existsSync(envPath)) {
            await fs.appendFile(envPath, `\n${envContent}`);
        } else {
            await fs.writeFile(envPath, envContent);
        }

        spinner.succeed(chalk.green('MongoDB Authentication successfully initialized!'));

        console.log('\nNext Steps:');
        console.log(`1. Review the generated files in ${chalk.cyan(isSrc ? 'src/lib' : 'lib')}, ${chalk.cyan(isSrc ? 'src/models' : 'models')}, and ${chalk.cyan(isSrc ? 'src/app' : 'app')}.`);
        console.log(`2. Update your ${chalk.cyan('.env')} file with real values.`);
        console.log(`3. Run: ${chalk.yellow('npm run dev')}`);

    } catch (error) {
        spinner.fail('Setup failed.');
        console.error(error);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
