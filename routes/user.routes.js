const express=require("express")
const userRouter=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { UserModel } = require("../models/user.model")


userRouter.post("/register",async(req,res)=>{
   const {name,password,age}=req.body
    try{
        const newuser=await UserModel.findOne({name})
        if(newuser){
            res.send("user has been alredy register")
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                const user=new UserModel({name,password:hash,age})
                await user.save()
                res.status(200).send({"msg":"Register successfull"})
               
            })
        }
        
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {name,password}=req.body
    try{
        const user = await UserModel.findOne({name})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    res.status(200).send({"msg":"Login Successfull","token":jwt.sign({"userId":user._id},"mona")})
                }else{
                    res.status(400).send({"msg":"wrong password"})
                }
            })
        }else{
            res.status(200).send({"msg":"user not found"})
        }
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

module.exports={userRouter}