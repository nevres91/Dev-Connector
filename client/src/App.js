import React, { Fragment, useEffect } from 'react';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
if (localStorage.token)
{
  setAuthToken(localStorage.token);
}

const App = () =>
{
  useEffect(() =>
  {
    store.dispatch(loadUser()); //forgot parentheses
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Landing />} />
          </Routes>
          <section className="container">
            <Alert />
            <Routes>
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/profiles" element={<Profiles />} />
              <Route exact path="/profile/:id" element={<Profile />} />
              <Route exact path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
              <Route exact path="/create-profile" element={<PrivateRoute component={CreateProfile} />} />
              <Route exact path="/edit-profile" element={<PrivateRoute component={EditProfile} />} />
              <Route exact path="/add-experience" element={<PrivateRoute component={AddExperience} />} />
              <Route exact path="/add-education" element={<PrivateRoute component={AddEducation} />} />
              <Route exact path="/posts" element={<PrivateRoute component={Posts} />} />
              <Route exact path="/posts/:id" element={<PrivateRoute component={Post} />} />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
};
export default App;
