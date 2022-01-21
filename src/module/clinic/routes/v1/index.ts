import clinicAuthRoute from './clinicAuth.route'
import clinicQueueRoute from './clinicQueue.route'
import ClinicProfileRoute from './clinicProfile.route'
import clinicTransaction from './clinicTransaction.route'
import clinicSubscription from './clinicSubscription.route'
import { Router } from 'express'

const clinicRoutes:Router = Router()

clinicRoutes.use('/auth',clinicAuthRoute)
clinicRoutes.use('/queue',clinicQueueRoute)
clinicRoutes.use('/profile',ClinicProfileRoute)
clinicRoutes.use('/transaction',clinicTransaction)
clinicRoutes.use('/subscription',clinicSubscription)

export default clinicRoutes