const Stock = require('../models').Stock;


exports.getDefault = (req, res) => {
    res.json({msg: 'User Work'});
};


exports.Stock = (req, res) => {
    try {
        Stock.findAll().then(data =>
            res.status(200).json({msg: 'Success', users: data})
        ).catch(err => {
            res.status(400).json({msg: 'Failed', error: err})
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: 'Failed'});
    }
};