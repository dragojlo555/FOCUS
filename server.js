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
app.use('/public',express.static('public'));

app.get('/', (req, res) => res.send('Hello World'));
//use Routes
app.use('/api/users',users_route);
app.use('/api/team',teams_route);
//app.use('/api/profile',profile);

const port=process.env.PORT || 3000;


sequelize
    .sync({alter:true})
    .then(result => {
      //   console.log(result)
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });




