import { Express } from 'express'

import { bodyParser, cors, contentType } from '@/main/config/middlewares/'

export function setUpMiddlewares (app: Express): void {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}