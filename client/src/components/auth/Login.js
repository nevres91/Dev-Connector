import React from 'react'
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { login } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';

const Login = ({ login, isAuthenticated }) =>
{
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e =>
  {
    e.preventDefault();
    login(email, password);
  }

  //Redirect if loged in
  const navigate = useNavigate();
  if (isAuthenticated)
  {
    return navigate('/dashboard')
  }
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
};
const mapStateToProps = state => ({
  // auth: state.auth ...this will give us everything from reducers/auth.js (initialState)
  isAuthenticated: state.auth.isAuthenticated // we need only isAuthenticated for redirecting us.
});

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

export default connect(mapStateToProps, { login })(Login);

