const express=require('express');
const sequelize = require('./util/database');
const bodyParser=require('body-parser');
const path = require('path');
const teams_route=require('./routes/api/teams');
const users_route=require('./routes/api/users');


const app=express();
//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/public',express.static('public'));



app.get('/', (req, res) => res.send('Hello World'));
//use Routes
app.use('/api/users',users_route);
app.use('/api/team',teams_route);
//app.use('/api/profile',profile);

const port=process.env.PORT || 5000;

//alter:true
sequelize
    .sync({})
    .then(result => {
      //   console.log(result)
        app.listen(port);
    })
    .catch(err => {
        console.log(err);
    });




