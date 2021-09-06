// import { sign as jwtSign, verify as jwtVerify,decode as jwtDecode } from "jsonwebtoken";
var JWT = require('jsonwebtoken')
class JwtService {

     private secretKey = "my secret key"

    createJwt(payload:object,expiresIn:number,){
      const jwtToken =  JWT.sign(payload,this.secretKey,{expiresIn:expiresIn})
      return jwtToken
    }
    verfiyJwt(jwt:string,){
        return JWT.verify(jwt,this.secretKey)
    }
    jwtDecode(jwt:string){
      return JWT.decode(jwt)
    }

}

export const jwtService:JwtService = new JwtService() 