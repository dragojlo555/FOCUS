const express = require('express');
const router = express.Router();
const userController=require('../../Controller/users');
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', userController.getDefault);

module.exports = router;