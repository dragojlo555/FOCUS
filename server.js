const express=require('express');
const sequelize = require('./util/database');
const Product=require('./models/product');
const path = require('path');
const users =require('./routes/api/users');
const profile =require('./routes/api/profile');

const app=express();

app.get('/', (req, res) => res.send('Hello World'));
//use Routes
app.use('/api/users',users);
//app.use('/api/profile',profile);

const port=process.env.PORT || 3000;

/*
Product.create({
   ime:'Drago',
    price: 25,
    title: 'Nekosta',
    imageUrl: 'Nesto',
    description: 'IOpis'
    }
).then(

).catch(err=>console.log(err));*/

sequelize
    .sync({alter:true})
    .then(result => {
      //   console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });




