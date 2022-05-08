import express from 'express'

import { setUpMiddlewares } from '@/main/config/middlewares'
import { setUpRoutes } from '@/main/config/routes'

const app = express()
setUpMiddlewares(app)
setUpRoutes(app)

export default app
