#!/usr/bin/env node

// Downloads .agent/ from johansabent/antigravity-kit-jp into the target directory.
// Uses only Node.js built-ins — no external dependencies.

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const REPO_TARBALL = 'https://codeload.github.com/johansabent/antigravity-kit-jp/tar.gz/refs/heads/main';
const AGENT_DIR_NAME = '.agent';

// Resolve target directory from --path flag or default to CWD
const args = process.argv.slice(2);
const pathFlag = args.indexOf('--path');
const targetDir = pathFlag !== -1 ? path.resolve(args[pathFlag + 1]) : process.cwd();
const targetAgent = path.join(targetDir, AGENT_DIR_NAME);

const FIRST_SESSION_PROMPT = `
╔══════════════════════════════════════════════════════════════════╗
║              ✅  .agent/ installed successfully                  ║
╠══════════════════════════════════════════════════════════════════╣
║  NEXT STEP — paste this prompt into your AI editor chat:         ║
║                                                                  ║
║  "Read .agent/rules/GEMINI.md and all referenced files.          ║
║   Then create every editor config file needed for this editor    ║
║   (e.g. .cursorrules, .windsurfrules, .clinerules) so all        ║
║   workflows and agents are active from your next response."      ║
╚══════════════════════════════════════════════════════════════════╝
`;

async function downloadAndExtract() {
    console.log(`\n📦 Downloading .agent/ from johansabent/antigravity-kit-jp...`);

    // Stream tarball → gunzip → tar extract filtered to .agent/ only
    const tmpTar = path.join(targetDir, '_ag_kit_tmp.tar.gz');

    await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(tmpTar);
        https.get(REPO_TARBALL, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                https.get(res.headers.location, (res2) => res2.pipe(file)).on('error', reject);
            } else {
                res.pipe(file);
            }
            file.on('finish', resolve);
        }).on('error', reject);
    });

    // Use system tar to extract only the .agent/ subtree (works on macOS, Linux, WSL, Git Bash)
    // Inner directory in the tarball is antigravity-kit-jp-main/.agent/
    const extractDir = path.join(targetDir, '_ag_kit_extract');
    fs.mkdirSync(extractDir, { recursive: true });

    const tarResult = spawnSync('tar', [
        '-xzf', tmpTar,
        '--strip-components=1',
        '--include=*/.agent/*',  // macOS BSD tar
        '-C', extractDir,
    ], { stdio: 'pipe' });

    // GNU tar uses --wildcards --exclude-from, so try again if BSD-style failed
    if (tarResult.status !== 0) {
        const tarGnu = spawnSync('tar', [
            '-xzf', tmpTar,
            '--strip-components=1',
            '--wildcards',
            '*/.agent/*',
            '-C', extractDir,
        ], { stdio: 'pipe' });

        if (tarGnu.status !== 0) {
            throw new Error(`tar extraction failed:\n${tarGnu.stderr?.toString()}`);
        }
    }

    // Move extracted .agent/ to target
    const extracted = path.join(extractDir, AGENT_DIR_NAME);
    if (!fs.existsSync(extracted)) {
        throw new Error('Could not find .agent/ in the downloaded archive.');
    }

    if (fs.existsSync(targetAgent)) {
        console.log(`⚠️  Existing .agent/ found — backing up to .agent.bak/`);
        fs.renameSync(targetAgent, path.join(targetDir, '.agent.bak'));
    }

    fs.renameSync(extracted, targetAgent);

    // Cleanup
    fs.rmSync(tmpTar, { force: true });
    fs.rmSync(extractDir, { recursive: true, force: true });
}

(async () => {
    try {
        fs.mkdirSync(targetDir, { recursive: true });
        await downloadAndExtract();
        console.log(FIRST_SESSION_PROMPT);
    } catch (err) {
        console.error(`\n❌ Installation failed: ${err.message}`);
        process.exit(1);
    }
})();
