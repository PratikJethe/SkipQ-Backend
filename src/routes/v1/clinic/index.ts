import clinicAuthRoute from './clinicAuth.route'
import clinicQueueRoute from './clinicQueue.route'
import { Router } from 'express'

const clinicRoutes:Router = Router()

clinicRoutes.use('/auth',clinicAuthRoute)
clinicRoutes.use('/queue',clinicQueueRoute)

export default clinicRoutes