import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from "../actions/types";

const initialState = {
  profile: null, // when we log in its gonna make request, its gonna hold all of our profile data also when we visit another users profile page.
  profiles: [], // profile listing pages, list of developers...that state goes in here
  repos: [], // place for fetched github repos
  loading: true,
  error: {} // for any errors in the request
}
function profileReducer(state = initialState, action)
{
  // export default function (state = initialState, action){

  const { type, payload } = action;

  switch (type)
  {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      }
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null
      }
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      }
    default:
      return state;
  }
}
export default profileReducer;