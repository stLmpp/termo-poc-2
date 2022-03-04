const { spawn } = require('child_process');
const { mkdir, rename, readdir, rm, writeFile, readFile } = require('fs/promises');
const { join } = require('path');
const AdmZip = require('adm-zip');

const packageJson = `{
  "name": "termo-poc-2-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "stLmpp",
  "license": "ISC",
  "dependencies": {
    "compression": "~1.7.4",
    "express": "~4.17.3",
    "helmet": "~5.0.2"
  }
}`;

const indexJs = `const { join } = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');

const app = express()
  .use(helmet())
  .use(compression())
  .use(express.static(join(process.cwd(), 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).send('System online at ' + new Date().toUTCString());
});

app.listen(process.env.PORT ?? 3000, process.env.HOST ?? 'localhost');
`;

async function asyncSpawn(command, options) {
  const newOptions = { ...options, shell: true };
  return new Promise((resolve, reject) => {
    try {
      const spawnCmd = spawn(command, newOptions);
      spawnCmd.on('close', () => {
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

const distPath = join(process.cwd(), 'dist');

async function main() {
  await rm(distPath, { recursive: true });
  await asyncSpawn('yarn build');
  const pathsToMove = await readdir(distPath);
  await mkdir(join(distPath, 'public'));
  await Promise.all(pathsToMove.map(path => rename(join(distPath, path), join(distPath, 'public', path))));
  await Promise.all([
    writeFile(join(distPath, 'index.js'), indexJs),
    writeFile(join(distPath, 'package.json'), packageJson),
  ]);
  await asyncSpawn('npm i --prefix ./dist --package-lock-only');

  const zip = new AdmZip();
  zip.addLocalFolder(distPath);

  const version = JSON.parse(await readFile(join(process.cwd(), 'package.json')).then(file => file.toString())).version;

  await writeFile(join(distPath, `${version}.zip`), zip.toBuffer());
}

main().then();
