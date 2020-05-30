const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config;

const {registerValidation, loginValidation} = require('../validation');

 
router.post('/register', async (req,res) => {

// LETS VALIDATE

const {error} = registerValidation(req.body);
if(error) return res.status(400).send(error.details[0].message);



// Check if the user is aldready in db

const emailExist = await User.findOne({ email: req.body.email});
if(emailExist) return res.status(400).send('Email already exits');



// HASH PASSWORD

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash (req.body.password, salt);



// CREATE NEW USER
 
const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
});
try{
    const savedUser = await user.save();
    res.send( {user: user._id});
}catch(err) {
    res.status(400).send(err);
}


  

});

// LOGIN

router.post('/login', async (req,res) => {
   
   
    // LETS VALIDATE

    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    // Check if the email exist
    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');


    // PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Ivalid password');

    // Create token
    
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY );
    res.header('auth-token', token).send(token);


    


});








module.exports = router;