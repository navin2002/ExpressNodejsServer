const express=require('express')
var fs = require('fs');
const app= express()
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User= require('./models/user')
const db="mongodb://127.0.0.1:27017/demo"
var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser')
//!!!dont use localhost use 127.0.0.1
/*
mongoose.connect(db,err=>
    {
        if(err)
        {
            console.error("Error!"+err)
        }
        else
        {
            console.log("connected")
        }

    })*/

function verifyToken(req,res,next)
{
    if(!req.headers.authorization)
    {
        return res.status(401).send("unauthorized no header")
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token==="null")
    {
        return res.status(401).send("unauthorized no token")
    }
    let payload=jwt.verify(token,'secret')
    if(!payload)
    {
        return res.status(400).send('unauthorized request token mismatch')
    }
    req.userId=payload.subject
    next()

}

app.post('/register',bodyParser.json(),(req,res)=>{

    let userData=req.body
    console.log("0")

    console.log(JSON.stringify(userData)+"  data");
    let user=new User(userData)
console.log("1")
   /*
    user.save((error,registeredUser) =>{
        if(error)
        {
        console.log(error)
        }
        else
        {
            let payload={subject: registeresUser._id}//convention for payload structure
            let token=jwt.sign(payload,'secretKey')
            res.status(200).send({token})
        }

     })*/
     user.save().then(registeredUser => {
        let payload={subject: registeredUser._id}//convention for payload structure
        let token=jwt.sign(payload,'secret')
        res.status(200).send({token})
        console.log("saved!")
      }).catch(
        err => console.log(err)
      )


})

app.post('/login',bodyParser.json(),(req,res)=>{

    let userData=req.body;
    console.log(JSON.stringify(userData));
    console.log(3);
    User.findOne({email:userData.email}).then(
        user=>
        {
            if(!user)
            {
                res.status(401).send('Invalid email')
            }
            else if(user.password!=userData.password)
            {
                res.status(401).send('Invalid password')
            }
            else{
                let payload={subject:user._id}
                let token=jwt.sign(payload,'secret')
                res.status(200).send({token})
            }
        }


    ).catch(
        err => console.log(err)
      )
  /*
    User.findOne({email:userData.email},(error,user)=>{

        if(error)
        {
            console.log(error)
        }
        else{

            if(!user)
            {
                res.status(401).send('Invalid email')
            }
            else if(user.password!=userData.password)
            {
                res.status(401).send('Invalid password')
            }
            else{
                let payload={subject:user._id}
                let token=jwt.sign(payload,'secretKey')
                res.status(200).send({token})
            }




        }


    })*/




})

/*
app.get("/download/:xaxis/:yaxis",(req,res) =>{

const spawnSync = require("child_process").spawnSync;
//const { spawnSync } = require('child_process');
const pythonProcess = spawn('python',["script.py", req.params.xaxis, req.params.yaxis]);
pythonProcess.stdout.on('data', (data) => {
    console.log("success"+data);
    res.status(200).json({message:"done"})
   });



pythonProcess.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    res.download("abc.png");
    fs.unlinkSync("abc.png");
    });


})
*/
 //x axis is group by columns y axis is the the column to be selected
 //bodyParser.json(),verifyToken,
app.get("/getimage/:xaxis/:yaxis",(req,res) =>{
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["script.py", req.params.xaxis, req.params.yaxis]);

    pythonProcess.stdout.on('data', (data) => {
                    console.log("success"+data);
                   // res.status(200).json({message:"done"});
                    res.sendFile("abc.png", { root: '.' });
                    console.log("sent");
                });

     pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr:${data}`);
                });

      pythonProcess.on('exit', (code) => {
                    console.log(`child process close all stdio with code ${code}`);
                    //res.download("abc.png");
                    //fs.unlinkSync("abc.png");

                    });



    });




   /*
   const result = pythonProcess.stdout?.toString()?.trim();
  const error = pythonProcess.stderr?.toString()?.trim();

   const status = result === 'data';
  if (status) {
    res.status(200).json({message:"done"});

  } else {
    console.log(error)
    res.send(JSON.stringify({ status: 500, message: 'Server error' }))
  }

    pythonProcess.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.download("abc.png");
        fs.unlinkSync("abc.png");

        });
    */

    //res.sendFile(filepath)


    mongoose
    .connect(db)
    .then(() => {
      app.listen("3000", () => {
        console.log("Server is listening on port 3000");
      });
    })
    .catch((err) => {
      console.log("Error Occurred:"+err);
    });