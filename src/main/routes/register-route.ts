import { Router } from 'express'

import { makeRegisterUserController } from '@/main/factories'
import { adapterRoute } from '@/main/adapters'

export default (router: Router): void => {
  router.post('/register', adapterRoute(makeRegisterUserController()))
}
