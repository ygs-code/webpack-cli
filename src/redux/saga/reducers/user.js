/*
 * @Author: your name
 * @Date: 2020-12-11 16:04:31
 * @LastEditTime: 2021-08-20 14:43:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/redux/saga/reducers/user.js
 */
import {call, put, takeEvery, takeLatest} from "redux-saga/effects";
const ajax = async (id) => {
 
  return id;
};

export default {
  name: "user",
  fetchUser: function* (action) {
    try {
      const user = yield call(ajax, action.payload.userId);
      //触发redux reducers
      yield put({type: "user_setUserInfo", payload: {name: user}});
    } catch (e) {
      //   yield put({type: "USER_FETCH_FAILED", message: e.message});
    }
  },
};
