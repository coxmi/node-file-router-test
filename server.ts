
import express from 'express'
import { initFileRouter } from 'node-file-router'

const port = process.env.PORT || 4321
const fileRouter: { handler?: (req, res) => any } = {}


export async function setupRouter() {
	console.log('setupRouter')
	delete fileRouter.handler
	fileRouter.handler = await initFileRouter({
		baseDir: `${__dirname}/routes`,
	})
}


export async function serve({ dev }: { dev?: boolean } = {}) {
	

	const app = express()
	await setupRouter()

	app.use(async (req, res) => {
		console.log(`———— load page: ${req.url} ————`)

		if (dev) {
			console.log('clear modules')
			await setupRouter()
			const paths = Object.keys(require.cache)
			const frontend = paths.filter(x => x.includes('.build/routes'))
			frontend.map(path => {
				delete require.cache[path]
			})
		}
		return fileRouter.handler(req, res)
	})

	app.listen(port)	
	console.log(`Serving on http://localhost:${port}`)
}


// if is called directly, start server
if (require.main === module) serve()