import express, { Application,Request,Response,json, NextFunction} from "express"
import { mongoConnect } from "./config/mongodb"
import { userAuthRoute } from "./routes/v1/user"
import { v4 as uuidv4 } from 'uuid';
const app:Application = express()

mongoConnect().then(()=>{
   console.log('connected')
}).catch((error)=>{
   console.log('mongo connection failed')
   process.exit(1)
})

app.use(json());



app.use(function (req:Request, res:Response,next:NextFunction) {

   req.requestId = uuidv4();
   next();
 })

//user specific routes
app.use('/api/v1/user',userAuthRoute)

app.get('/',async (req:Request,res:Response)=>{
   return res.send('hello ts')
})

app.listen(3000,()=>console.log('running'))