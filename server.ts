import express from 'express'
import { initFileRouter } from 'node-file-router'

const port = process.env.PORT || 4321

export async function serve() {
	const app = express()
	const useFileRouter = await initFileRouter({
		baseDir: `${__dirname}/routes`,
	})

	app.use(useFileRouter);

	app.listen(port)
	console.log(`Serving on http://localhost:${port}`)
}


// if is called directly, start server
if (require.main === module) serve()