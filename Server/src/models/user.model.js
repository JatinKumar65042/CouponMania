import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt" ;

const userSchema = new Schema(
    {
        username : {
            type: String,
            required : [true , "username is required"],
            trim : true
        },
        email : {
            type : String, 
            required : [true , "email is required"],
            unique : true ,
            lowercase : true,
            trim : true,
            match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please fill valid email Address"]
        },
        password : {
            type : String,
            required : [true , "password is required"]
        },
        role:{
            type:'String',
            enum:['USER','ADMIN'],
            default:'USER'
        },
    },{
        timestamps : true
    }
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            role: this.role ,
            email : this.email ,
            username : this.username 
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Set token expiration (1 day)
    );
}

export const User = mongoose.model('User' , userSchema) ;
