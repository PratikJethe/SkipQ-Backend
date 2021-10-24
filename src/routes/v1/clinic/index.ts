import clinicAuthRoute from './clinicAuth.route'
import clinicQueueRoute from './clinicQueue.route'
import ClinicProfileRoute from './clinicProfile.route'
import { Router } from 'express'

const clinicRoutes:Router = Router()

clinicRoutes.use('/auth',clinicAuthRoute)
clinicRoutes.use('/queue',clinicQueueRoute)
clinicRoutes.use('/profile',ClinicProfileRoute)

export default clinicRoutes