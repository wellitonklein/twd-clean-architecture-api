import { Express } from 'express'

import { bodyParser } from '@/main/config/middleware/'

export default (app: Express): void => {
  app.use(bodyParser)
}
