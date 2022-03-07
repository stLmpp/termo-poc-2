const { spawn } = require('child_process');
const { mkdir, rename, readdir, rm, writeFile, readFile, copyFile } = require('fs/promises');
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

const filesNotIncludedInServer = new Set(['node_modules', 'yarn.lock', 'package-lock.json']);

async function main() {
  console.log('Starting build');
  console.log('Deleting dist');
  await rm(distPath, { recursive: true });
  console.log('Executing build of front-end');
  await asyncSpawn('yarn build');
  const pathsToMove = await readdir(distPath);
  await mkdir(join(distPath, 'public'));
  console.log('Moving front-end to public folder');
  await Promise.all(pathsToMove.map(path => rename(join(distPath, path), join(distPath, 'public', path))));
  const serverFiles = await readdir(serverPath).then(files =>
    files.filter(file => !filesNotIncludedInServer.has(file))
  );
  console.log('Moving server files');
  await Promise.all(serverFiles.map(file => copyFile(join(serverPath, file), join(distPath, file))));
  console.log('Generating package-lock.json file');
  await asyncSpawn('npm i --prefix ./dist --package-lock-only');

  const zip = new AdmZip();
  zip.addLocalFolder(distPath);

  const version = JSON.parse(await readFile(join(process.cwd(), 'package.json')).then(file => file.toString())).version;

  console.log('Zipping file');
  await writeFile(join(distPath, `${version}.zip`), zip.toBuffer());

  console.log(`Build version ${version} finished!`);
}

main().then();
