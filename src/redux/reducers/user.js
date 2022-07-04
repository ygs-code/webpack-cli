import {USER_FETCH_SUCCEEDED} from "../actions";

const initialState = {
  name: "会员初始化数据",
};
export const userReducers = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case USER_FETCH_SUCCEEDED:
      return {...state, ...payload};
    default:
      return state;
  }
};
