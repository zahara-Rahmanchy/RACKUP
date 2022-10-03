const express = require('express');
// const firebase = require('firebase');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const projectRoute = require('./routes/project-routes')
const db = admin.firestore()
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// const db = firebase.firestore()

const usersRoutes = require('./routes/users-routes');

const app = express();

// app.use(bodyParser.json);

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE');
    next();
})

app.use('/users', usersRoutes);

app.get('/', (req,res)=>{
    res.send('Hello!');
})

// firebase.initializeApp(firebaseConfig)
// .then(()=>{
//     app.listen(5000);
// })
// .catch(err=>{
//     alert(err);
// });
app.use("projectRoute")
app.listen(5000);