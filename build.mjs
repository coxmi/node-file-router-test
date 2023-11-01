import esbuild from 'esbuild'
import glob from 'fast-glob'
import { spawn } from 'node:child_process';

const routes = glob.sync('./routes/**.{ts,tsx,js,jsx}')
const isDev = process.argv[2] === '--dev'

const ctx = await esbuild.context({
  entryPoints: [
    'server.ts',
    ...routes
  ],
  outdir: '.build',
  bundle: true,
  platform: 'node',
  outExtension: { '.js': '.cjs' },
  packages: 'external',
  plugins: [
    after(isDev)
  ]
})

if (isDev) {
  await ctx.watch();
  console.log('watch mode is active');
} else {
  await ctx.rebuild();
  await ctx.dispose();
}

let server;

function after(dev = false) {
  return {
    name: 'after',
    setup: build => dev && build.onEnd(() => restartServer())
  }
}

const restartServer = () => {
  if (server) {
    server.kill();
    console.log('restarting service');
  }

  server = spawn('node', ['.build/server.cjs'], { stdio: 'inherit' });
};