const { spawn } = require('child_process');
const { mkdir, rename, readdir, rm, writeFile, readFile, copyFile} = require('fs/promises');
const { join } = require('path');
const AdmZip = require('adm-zip');

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
const serverPath = join(process.cwd(), 'server');

async function main() {
  await rm(distPath, { recursive: true });
  await asyncSpawn('yarn build');
  const pathsToMove = await readdir(distPath);
  await mkdir(join(distPath, 'public'));
  await Promise.all(pathsToMove.map(path => rename(join(distPath, path), join(distPath, 'public', path))));

  await Promise.all([
    copyFile(join(serverPath, 'index.js'), join(distPath, 'index.js')),
    copyFile(join(serverPath, 'database.js'), join(distPath, 'database.js')),
    copyFile(join(serverPath, 'package.json'), join(distPath, 'package.json')),
  ]);
  await asyncSpawn('npm i --prefix ./dist --package-lock-only');

  const zip = new AdmZip();
  zip.addLocalFolder(distPath);

  const version = JSON.parse(await readFile(join(process.cwd(), 'package.json')).then(file => file.toString())).version;

  await writeFile(join(distPath, `${version}.zip`), zip.toBuffer());
}

main().then();
