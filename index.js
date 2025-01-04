const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const users = [];

// server
const sessions = new Map();


app.get("/", authMiddleware, (req, res) =>{
    // console.log(req.cookies);
    const user = req.user;
    res.json({message: `helloe!!! ${user.username}`});
})

app.get("/admin", (req,res) =>{
    res.json(users);
})

app.post("/register",async (req,res) =>{
    try{
        const {username, password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = {username: username, password: hash};
        users.push(user);
        res.status(201).json({message: "User is created"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }

})

app.post("/login", async (req,res) =>{
    const {username, password} = req.body;
    console.log(users)
    const user = users.find(ele => ele.username === username);

    if(!user) {
        return res.status(401).json({message: "Incorrect username"});
    }
    try{
        const isMatched = await bcrypt.compare(password, user.password);
        console.log(isMatched);
        if(!isMatched){
            return res.status(402).json({message: "Password is incorrect"});
        }
        
    }catch(err){
        return res.status(500).json({message: err.message});
    }
    const sessionId = crypto.randomUUID();

    sessions.set(sessionId, user);
    res.cookie("sessionId", sessionId);
    res.status(201).json({message: "User is logged in"});


})

app.delete("/logout", (req,res) =>{
    const sessionId = req.cookies.sessionId;// req.user each user have it own req.user.

    const user = sessions.get(sessionId);
    if(!user){
        return res.json({message: "User already logout"});
    }


    sessions.delete(sessionId);
    console.log(sessionId);
    res.json({message: ` ${user.username} Logout successfully`});
})

function authMiddleware(req, res, next){
    const user = sessions.get(req.cookies.sessionId);

    if(!user){
        return res.status(400).json({message: "Unauthorised"});
    }
    req.user = user;
    next();
}

app.listen(5060, ()=>{
    console.log("Server is running");
})