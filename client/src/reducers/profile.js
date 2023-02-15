import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS, RESET_PPROFILE_LOADING } from "../actions/types";

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
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      }
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
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
    case RESET_PPROFILE_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false
      }
    default:
      return state;
  }
}
export default profileReducer;