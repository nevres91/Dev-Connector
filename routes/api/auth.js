const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const auth = require('../../middleware/auth'); //whenever we wanna use this middleware we add it as second parrameter. Just doing that makes the route protected.
const {check, validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');






// @route    GET api/auth
// @desc     Test route
// @access   Public    
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Since its the protected route and we used a token which has the id and in our middleware we set 'request.user' to the user in the token, we can simply pass in 'req.user.id'. Also we dont want to return the password, so we excluded it.
    res.json(user); //we send along the user.
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user and get token
// @access   Public    
router.post('/',[
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  // console.log(req.body); //'body' is object of data thats gonna be sent to this route. In order for this to work, we need to initialize the middleware for the body parser. (server.js)
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const {email, password} = req.body;

  try {
    // See if the user exists
    let user = await User.findOne({email})
    if(!user){
      return res.status(400)
      .json({errors: [{msg: 'Invalid Credentials'}]})
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400)
      .json({errors: [{msg: 'Invalid Credentials'}]})
    }
    
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