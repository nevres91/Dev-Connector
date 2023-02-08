const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){ // a middleware function is basicaly just a function that has access to request and response and 'next' is a callback that we have to run once we're done so that it moves on to the next piece of middleware.
  
  // get the token from the header, when we send a request to a protected route, we need to send the token within a header.
  const token = req.header('x-auth-token');  //we have acces to 'req' object which has property 'header'. 'x-auth-token' is the header key that we want to send the token in.

  //check if no token
  if(!token) {
    return res.status(401).json({msg: 'No token, authorisation denied'});
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')); // decoding token, it takes 2 things, token and secret.

    req.user = decoded.user; //take the req object and assign a value to user
    next(); // we call it in any middleware
  } catch (err) {
    res.status(401).json({msg: 'Token is not valid'}); 
  }
}