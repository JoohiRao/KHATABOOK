const express = require('express');
const fs = require('fs');
const app= express();
const path = require('path');
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,"public")))


app.set('view engine', 'ejs')
app.get("/",(req,res)=>{
    fs.readdir(`./hisaab`,(err,files)=>{
        if(err) return res.status(500).send(err)
            res.render("index",{files:files})
    })
 
})


app.get("/create",(req,res)=>{  //
    res.render("create")

})

let fileitem={}
app.post("/createpost",(req,res)=>{

    const curr=new Date()
    const datakey=`${curr.getDate()}-${curr.getMonth()}-${curr.getFullYear()}`
    if(!fileitem[datakey]){
        fileitem[datakey]=1
    }
    else{
        fileitem[datakey]+=1
    }

    const filename=`${datakey}-${fileitem[datakey]}.txt`

    const filepath=`./hisaab/${filename}`

    fs.writeFile(filepath,req.body.content,(err)=>{
        if(err) return res.status(500).send(err)
        res.redirect("/")
    })
    
})


app.get("/edit/:filename",(req,res)=>{

    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",(err,filedata)=>{
        if(err) return res.status(500).send(err)
       res.render("edit",{filename:req.params.filename,data:filedata})
    })

})

app.post("/update/:filename",(req,res)=>{
    fs.writeFile(`./hisaab/${req.params.filename}`,req.body.content,(err)=>{
        if(err) return res.status(500).send(err)
        res.redirect("/")
    })
})

app.get("/delete/:filename",(req,res)=>{   
    fs.unlink(`./hisaab/${req.params.filename}`,(err)=>{
        if(err) return res.status(500).send(err)
        res.redirect("/")
    }) 
})


app.get("/hisaab/:filename",(req,res)=>{
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",(err,files)=>{
        if(err) return res.status(500).send(err)
        res.render("show",{filename:req.params.filename,data:files})
    })
})

app.listen(3000)