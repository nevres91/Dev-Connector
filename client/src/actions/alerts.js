import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuidv4 } from 'uuid';


//we wanna be able to dispatch more than one action or actiontype, we add 'dispatch' and we're able to do this because of thunk middleware.
export const setAlert = (msg, alertType, timeout = 5000) => dispatch =>
{
  const id = uuidv4(); // we wanna randomly generate id.
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
}