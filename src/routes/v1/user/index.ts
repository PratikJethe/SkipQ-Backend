import userAuthRoutes from "./userAuth.route";

import { Router } from 'express'

const userRoutes:Router = Router()

userRoutes.use('/auth',userAuthRoutes)


export  default userRoutes