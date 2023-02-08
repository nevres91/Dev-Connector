import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
/* eslint-disable import/no-anonymous-default-export */
const initialState = [];

export default function (state = initialState, action)
{

  const { type, payload } = action;

  switch (type)
  {
    case SET_ALERT: // we dispatch setalert and return the array with the payload, with new alert.
      return [...state, payload]; //that will add a new alert to the array
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload) // remove will return all alerts except the one that matches the payload.
    default:
      return state;
  }
};