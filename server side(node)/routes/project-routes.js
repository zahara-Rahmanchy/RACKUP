const express = require('express');
const bodyParser = require('body-parser');
// const { app } = require('firebase-admin');
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//to get information from upload form
app.post("/add-project",(req,res)=>{
    res.send(req.body);
    console.log(req.body)
})
