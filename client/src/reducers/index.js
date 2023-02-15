import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';


export default combineReducers(
  {
    // Object that will have any reducers that we create
    alert,
    auth,
    profile,
    post
  })