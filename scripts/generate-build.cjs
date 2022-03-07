const { spawn } = require('child_process');
const { mkdir, rename, readdir, rm, writeFile, readFile } = require('fs/promises');
const { join } = require('path');
const AdmZip = require('adm-zip');
const { build } = require('esbuild');

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
const externalDependencies = ['geoip-lite'];

async function main() {
  console.log('Starting build');

  console.log('Deleting dist');
  await rm(distPath, { recursive: true });

  console.log('Installing front-end dependencies');
  await asyncSpawn('yarn install');

  console.log('Executing build of front-end');
  await asyncSpawn('yarn build');
  const pathsToMove = await readdir(distPath);

  console.log('Creating public folder');
  await mkdir(join(distPath, 'public'));

  console.log('Moving front-end to public folder');
  await Promise.all(pathsToMove.map(path => rename(join(distPath, path), join(distPath, 'public', path))));

  console.log('Installing server dependencies');
  await asyncSpawn('npm i --prefix ./server');

  console.log('Executing build server');
  await build({
    entryPoints: [join(serverPath, 'index.js')],
    bundle: true,
    platform: 'node',
    minify: true,
    outfile: join(distPath, 'index.js'),
    external: externalDependencies,
  });

  console.log('Getting package.json from server');
  const packageJsonServerBuffer = await readFile(join(serverPath, 'package.json'));
  const packageJsonServer = JSON.parse(packageJsonServerBuffer.toString());
  const dependencies = { ...packageJsonServer.dependencies };
  packageJsonServer.dependencies = externalDependencies.reduce(
    (object, dependency) => ({ ...object, [dependency]: dependencies[dependency] }),
    {}
  );

  console.log('Adding package.json on dist');
  await writeFile(join(distPath, 'package.json'), JSON.stringify(packageJsonServer));

  // console.log('Installing dependencies');
  // await asyncSpawn('npm i --prefix ./dist');

  const zip = new AdmZip();
  zip.addLocalFolder(distPath);

  const version = JSON.parse(await readFile(join(process.cwd(), 'package.json')).then(file => file.toString())).version;

  console.log('Zipping file');
  await writeFile(join(distPath, `${version}.zip`), zip.toBuffer());

  console.log(`Build version ${version} finished!`);
}

main().then();
