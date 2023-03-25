
const express=require("express")
const{connection} = require("./db")
const { auth } = require("./middleware/authMiddleware")
const { todoRouter } = require("./routes/todo.routes")
const { userRouter } = require("./routes/user.routes")
require("dotenv").config()
const app = express()

app.use(express.json())

app.use("/user",userRouter)
app.use(auth)
app.use("/todo",todoRouter)


app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("server is connected to db");
    }catch(err){
        console.log(err);
    }
    console.log("server is running");
})