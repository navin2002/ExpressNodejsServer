const express=require('express')
var fs = require('fs');
const app= express()
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
app.get("/getimage/:xaxis/:yaxis",(req,res) =>{
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["script.py", req.params.xaxis, req.params.yaxis]);

    pythonProcess.stdout.on('data', (data) => {
                    console.log("success"+data);
                   // res.status(200).json({message:"done"});
                    res.sendFile("abc.png", { root: '.' });
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


app.listen(3000)