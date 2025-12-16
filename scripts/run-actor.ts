#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

async function actorExists(actorName: string): Promise<boolean> {
  const actorPath = path.join(process.cwd(), 'actors', actorName);
  try {
    await fs.access(actorPath);
    return true;
  } catch {
    return false;
  }
}

async function listActors(): Promise<string[]> {
  const actorsDir = path.join(process.cwd(), 'actors');
  try {
    const entries = await fs.readdir(actorsDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

async function runActorCommand(actorName: string, command = 'start'): Promise<void> {
  return new Promise((resolve, reject) => {
    const actorDir = path.join(process.cwd(), 'actors', actorName);
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    console.log(`🚀 Running actor '${actorName}'...`);
    console.log(`📍 Directory: ${actorDir}`);
    console.log(`📦 Command: ${npm} ${command}\n`);

    const child = spawn(npm, [command], {
      cwd: actorDir,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Actor command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: pnpm start <actor-name> [command]');
    console.log('');
    console.log('Arguments:');
    console.log('  actor-name    Name of the actor to run');
    console.log('  command       Command to run (default: start)');
    console.log('');

    const actors = await listActors();
    if (actors.length > 0) {
      console.log('Available actors:');
      actors.forEach((actor) => console.log(`  - ${actor}`));
    } else {
      console.log('No actors found. Use "pnpm run cli create" to create one.');
    }

    process.exit(0);
  }

  const actorName = args[0];
  const command = args[1] || 'start';

  if (!(await actorExists(actorName))) {
    console.error(`❌ Actor '${actorName}' not found in actors/ directory`);

    const actors = await listActors();
    if (actors.length > 0) {
      console.log('\nAvailable actors:');
      actors.forEach((actor) => console.log(`  - ${actor}`));
    }

    process.exit(1);
  }

  try {
    await runActorCommand(actorName, command);
  } catch (error) {
    console.error('❌ Error running actor:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Runner Error:', error);
  process.exit(1);
});
