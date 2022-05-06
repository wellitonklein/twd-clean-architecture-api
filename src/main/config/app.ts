import express from 'express'

import setUpMiddleware from '@/main/config/middleware'

const app = express()
setUpMiddleware(app)

export default app
