const express = require('express');
const {body, query} = require('express-validator/check');
const router = express.Router();
const stockController = require('../../Controller/stock');

router.get('/',stockController.Stock);



module.exports=router;