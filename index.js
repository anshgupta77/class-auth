require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());
const users = [];

// server
// const sessions = new Map();
// const 


app.get("/", authToken, (req, res) =>{
    // console.log(req.cookies);
    const user = req.user;
    console.log(user)
    res.json({message: `helloe!!! ${user}`});
    // res.json({message: "Hello world",});
})



function authToken(req, res, next){
    // console.log(req.headers);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token",token);

    if(!token){
        return res.status(500).json({message: "Not authorise"});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, token_data){
        if(err){
            return res.status(500).json({message: "Forbidden"});
        }
        // userinfo.iat
        req.user = token_data.username;
        next();
    })
}

app.listen(5061, ()=>{
    console.log("Server is running 5061");
})

