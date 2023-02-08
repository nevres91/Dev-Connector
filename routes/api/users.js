const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// Bringing up our user model
const User = require('../../models/user');



// @route    POST api/users
// @desc     Register User
// @access   Public    
router.post('/',[
  check('name', 'Name is required')
  .not()
  .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  // console.log(req.body); //'body' is object of data thats gonna be sent to this route. In order for this to work, we need to initialize the middleware for the body parser. (server.js)
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const {name, email, password} = req.body;

  try {
    // See if the user exists
    let user = await User.findOne({email})
    if(user){
      return res.status(400).json({errors: [{msg: 'User already exists'}]})
    };
    
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })

    user = new User({    // -----------------------------1 - create the user
      name, 
      email,
      avatar,
      password
    });
    
    // Encrypt password  //------------------------------2 - hash the password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();  //-------------------------------3 - save the user in the database
    
    // Return json webtoken (because we want the user to be logged in right away after registering)
    const payload = { //---------------------------------4 - get the payload which includes user id
      user: {
        id: user.id
      }
    }
    jwt.sign(  //---5 - we sign the token
      payload, //---6 pass in the payload
      config.get('jwtSecret'), //---7 - pass in the secret
      {expiresIn: 360000},  // ---8 - expiration (optional)
      (err, token) => { // - 9 - inside the callback we get either error or the token, if we get the token we send it back to the client.
        if (err) throw err;
        res.json({token});
      } )
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }




}); 

module.exports = router;