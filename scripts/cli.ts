#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function updatePackageName(packageJsonPath: string, projectName: string): Promise<void> {
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  packageJson.name = projectName;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
}

function isValidProjectName(name: string): boolean {
  // Check if name contains only lowercase letters, numbers, and hyphens
  // Cannot start or end with a hyphen
  const validNameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return validNameRegex.test(name);
}

async function projectExists(projectName: string): Promise<boolean> {
  const projectPath = path.join(process.cwd(), 'crawlers', projectName);
  try {
    await fs.access(projectPath);
    return true;
  } catch {
    return false;
  }
}

async function createNewActor(): Promise<void> {
  console.log('🎬 Create New Crawler\n');

  let projectName = '';
  let isValid = false;

  while (!isValid) {
    projectName = await question('Enter project name (lowercase, numbers, hyphens only): ');

    if (!projectName || projectName.trim() === '') {
      console.log('❌ Project name cannot be empty');
      continue;
    }

    projectName = projectName.trim().toLowerCase();

    if (!isValidProjectName(projectName)) {
      console.log(
        '❌ Invalid project name. Use only lowercase letters, numbers, and hyphens. Cannot start or end with hyphen.',
      );
      continue;
    }

    if (await projectExists(projectName)) {
      console.log(`❌ Actor '${projectName}' already exists in crawlers/ directory`);
      continue;
    }

    isValid = true;
  }

  // Ask for project type
  console.log('\n📋 Select project type:');
  console.log('1. api - API-based actor');
  console.log('2. crawl - Web scraping actor');

  let projectType = '';
  let validType = false;

  while (!validType) {
    projectType = await question('Enter choice (1 or 2): ');

    if (projectType === '1') {
      projectType = 'api';
      validType = true;
    } else if (projectType === '2') {
      projectType = 'crawl';
      validType = true;
    } else {
      console.log('❌ Invalid choice. Please enter 1 for api or 2 for crawl.');
    }
  }

  const actorsDir = path.join(process.cwd(), 'crawlers');
  const newActorDir = path.join(actorsDir, projectName);

  // Choose template based on project type
  const projectTemplateDir =
    projectType === 'api'
      ? path.join(process.cwd(), 'shared', 'project-template')
      : path.join(process.cwd(), 'shared', 'project-template-browser');

  const storageTemplateDir = path.join(process.cwd(), 'shared', 'storage-template');
  const storageDestDir = path.join(newActorDir, 'storage');

  console.log(`\n🚀 Creating ${projectType} actor '${projectName}'...`);

  try {
    // Copy project template
    console.log(`📁 Copying ${projectType} project template...`);
    await copyDirectory(projectTemplateDir, newActorDir);

    // Copy storage template
    console.log('💾 Copying storage template...');
    await copyDirectory(storageTemplateDir, storageDestDir);

    // Update package.json name
    console.log('📦 Updating package.json...');
    const packageJsonPath = path.join(newActorDir, 'package.json');
    await updatePackageName(packageJsonPath, projectName);


    console.log(`\n✅ Crawler '${projectName}' created successfully!`);
    console.log(`📍 Location: ${newActorDir}`);
    console.log('\n🎯 Next steps:');
    console.log(`   cd crawlers/${projectName}`);
    console.log('   pnpm install');
    console.log('   pnpm start');
  } catch (error) {
    console.error('❌ Error creating actor:', error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: pnpm run cli <command>');
    console.log('');
    console.log('Commands:');
    console.log('  create    Create a new actor from template');
    console.log('');
    console.log('Example:');
    console.log('  pnpm run cli create');
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case 'create':
      await createNewActor();
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run "pnpm run cli" for available commands');
      process.exit(1);
  }

  rl.close();
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ CLI Error:', error);
  rl.close();
  process.exit(1);
});
