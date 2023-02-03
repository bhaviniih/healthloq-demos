import NIHReducer from "../NIH/reducer";

const allReducers = (state = {}, action) => {
  return {
    nihReducer: NIHReducer(state.nihReducer, action, state),
  };
};

export default allReducers;
