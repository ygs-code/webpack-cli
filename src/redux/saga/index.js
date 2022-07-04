import {call, put, takeEvery, takeLatest} from "redux-saga/effects";
import * as reducers from "./reducers";

/*
  在每个 `USER_FETCH_REQUESTED` action 被 dispatch 时调用 fetchUser
  允许并发（译注：即同时处理多个相同的 action）
*/
function* Saga() {
  // 定义异步的   reducers
  const rootReducersKeys = Object.keys(reducers);
  for (let key of rootReducersKeys) {
    let name = reducers[key].name || key;
    delete reducers[key].name;
    let reducersKeys = Object.keys(reducers[key]);
    for (let _key of reducersKeys) {
      yield takeEvery(`${name}_${_key}`, reducers[key][_key]);
    }
  }
}
// 获取 SagaActions
const getActions = (reducers) => {
  let actions = {};
  for (let key in reducers) {
    let name = reducers[key].name || key;
    delete reducers[key].name;
    for (let _key in reducers[key]) {
      actions = {
        ...actions,
        [name]: {
          [_key]: `${name}_${_key}`,
        },
      };
    }
  }
  return actions;
};
export const actions = getActions(reducers);
export default Saga;
