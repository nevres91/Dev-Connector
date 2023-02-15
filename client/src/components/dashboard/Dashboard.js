import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile, deleteAccount } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading } }) =>
{
  useEffect(() =>
  {
    getCurrentProfile();
  }, [getCurrentProfile])
  return loading && profile === null ? <Spinner /> : <Fragment>  {/*If the profile is null and its still loading then we gonna show the spinner else fragment. */}
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
      <i className="fa fa-user"></i> Welcome {user && user.name} {/*if user exists then show user.name*/}
    </p>

    {profile !== null ?
      <Fragment>
        <DashboardActions />
        <Experience experience={profile.experience} />
        <Education education={profile.education} />

        <div className="my-2">
          <button onClick={() => deleteAccount()} className="btn btn-danger">
            <i className="fas fa-user-minus"> Delete My Account</i>
          </button>
        </div>
      </Fragment >
      :
      <Fragment>
        <p>You have not yet setup a profile, please add some info</p>
        <Link to='/create-profile' className='btn btn-primary my-1'>
          Create Profile
        </Link>
      </Fragment>}
  </Fragment>;
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
}
const mapStateToProps = state => ({ // anything in state and reducer will be able to get into this component
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
