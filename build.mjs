import esbuild from 'esbuild'
import glob from 'fast-glob'

let server
const routes = glob.sync('./routes/**.{ts,tsx,js,jsx}')
let dev = process.argv[2] === '--dev'

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
        after(dev)
    ]
})


if (dev) {
	await ctx.watch()
} else {
	await ctx.rebuild()
	await ctx.dispose()
}


function after(dev = false) {
	return {
		name: 'after',
		setup: build => {
			dev && build.onEnd(async result => {
			    if (server) {
			    	console.log('———— on build: setupRouter —————')
			        await server.setupRouter()
			    } else {
			    	console.log('———— on initial build: serve —————')
			        server = await import('./.build/server.cjs')
			        server.serve({ dev: true })
			    }
			})
		}
	}
}