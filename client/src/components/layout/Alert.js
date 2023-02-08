import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

//we wanna map through alerts and output whatever the message is. We wanna make sure that its not null, and that is actually something in the array. We don't wanna output anything if the array is zero.
const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
  <div key={alert.id} className={`alert alert-${alert.alertType}`}> {/*embed it into app.js*/}
    {alert.msg}
  </div>
))


Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  alerts: state.alert //whatever state we want (alerts) and then state. (whatever we want from root reducer, we have only 'alert' reducer.) now we have props.alerts available to us.
});
export default connect(mapStateToProps)(Alert);
