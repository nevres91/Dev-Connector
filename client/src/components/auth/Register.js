import React from 'react'
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { register } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';

import { setAlert } from '../../actions/alerts'; //whenever we bring in an action and wanna use it, we must pass it in 'connect' (bottom). Connect takes 2 things. One is any state we wanna map, the second is object with any actions we wanna use.


// Since this is a form, we need to have some component state, because each input needs to have its own state, they also need to have 'onChange' handler so when we type in it updates the state.

const Register = ({ setAlert, register, isAuthenticated }) => //destructured props.setAlert.
{
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e =>
  {
    e.preventDefault();
    if (password !== password2)
    {
      setAlert('Passwords do not match', 'danger')
    } else
    {
      register({ name, email, password });
    }
  }
  //Redirect if loged in
  const navigate = useNavigate();
  if (isAuthenticated)
  {
    return navigate('/dashboard')
  }
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} />  {/*we want to associate this first input 'name' with the 'name' in the state. We add value={name} and we also need onChange handler. */}
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}

          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}

          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
}
const mapStateToProps = state => ({
  // auth: state.auth ...this will give us everything from reducers/auth.js (initialState)
  isAuthenticated: state.auth.isAuthenticated // we need only isAuthenticated for redirecting us.
});

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

export default connect(mapStateToProps, { setAlert, register })(Register); //allows us to acces props.setAlert



// We brought in 'connect' so that we can work with redux. We also brought in 'setAlert' action. We have to export connect and add setAlert action in order to use it, and it is available within props (we destructured it out of props), we called it when the passwords don't match and we set the message and alert type.
// When we go to the actions file, setAlert = we sent the message and the alertType, generated an id, we dispatched SET_ALERT with the msg, alertType and id. and when we go to the reducer, we added  that to the array.
// Alert componend that we created, is getting that state. We're mapping state to props, getting the alert state putting it inside prop 'alerts' destructuring it, making sure its not null, and that it has something in it, and if it does, we're gonna map through them and we're gonna output a div with the message and the styling based on the alert type.
