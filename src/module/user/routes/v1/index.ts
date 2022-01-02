import userAuthRoutes from "./userAuth.route";
import userProfileRoutes from "./userProfile.route";

import { Router } from 'express'

const userRoutes:Router = Router()

userRoutes.use('/auth',userAuthRoutes)
userRoutes.use('/profile',userProfileRoutes)


export  default userRoutes