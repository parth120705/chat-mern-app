import jwt from "jsonwebtoken"

export const generateToken=(userId,res)=>{
    const token=jwt.sign(
        {
            userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    )
    const options={
        maxAge:7*24*60*60*1000, //milliseconds
        httpsOnly:true, // prevent xxs attacts cross site scripting attacts
        sameSite:"strict", // CSRF attacts cross site request forgery attacts
        secure:true
    }
    res.cookie("jwt",token,options)

    return token;
}