
const express=require("express")
const todoRouter=express.Router()
const jwt=require("jsonwebtoken")
const { auth } = require("../middleware/authMiddleware")
const { TodoModel } = require("../models/todo.model")


todoRouter.get("/",async(req,res)=>{
   const token=req.headers.authorization.split(" ")[1]
   const decoded=jwt.verify(token,"mona")
    try{
        if(decoded){
            let newtodo=await TodoModel.find({"userId":decoded.userId})
            res.status(200).send(newtodo)
        }
       
    }catch(err){
        res.status(400).send({"msg":err.message})
    }

})


todoRouter.post("/add",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
   const decoded=jwt.verify(token,"mona")
    const payload=req.body
    try{
        if(decoded){
            const data=new TodoModel(payload)
            await data.save()
            res.status(200).send({"msg":"todo has been added"})
        }
        
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

todoRouter.patch("/update/:id",auth,async(req,res)=>{
    const id=req.params.id
    const data=req.body
    const userid=req.body.userId
    try{
        let payload=await TodoModel.findByIdAndUpdate({_id:id,userId:userid},{$set:data})
        res.status(200).send(JSON.stringify(payload))
    }catch(err){
        res.status(400).send({"msg":err.message})

    }
})



todoRouter.delete("/delete/:id",auth,async(req,res)=>{
    const id=req.params.id
    try{
        await TodoModel.findByIdAndDelete({_id:id})
        res.status(200).send({"msg":"data deleted "})
    }catch(err){
        res.status(400).send({"msg":err.message})

    }
})
module.exports={todoRouter}