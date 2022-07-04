import {createStore, applyMiddleware, combineReducers} from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {CheckDataType} from "@/utils";
import * as reducers from "./reducers";
import * as actions from "./actions";

// 注入saga
import saga, {actions as sagaActions} from "./saga";
// 注入modelsReducers
import modelsReducers, {
  actions as modelsActions,
  register,
  registers,
} from "./models";

const middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
  //不是生产环境
  middleware.push(createLogger()); //日志
}

// console.log("modelsActions=========", modelsActions);
// console.log("sagaActions=========", sagaActions);

// 检查 Actions  是否有重名
const checkMergeActions = (() => {
  const cacheKey = [];
  return function check(target) {
    for (let i = 1; i < arguments.length; i++) {
      let source = arguments[i];
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          if (CheckDataType.isObject(source[key])) {
            target[key] = {
              ...target[key],
              ...check({}, source[key]),
            };
          } else {
            if (cacheKey.includes(source[key])) {
              throw new Error(`actions 名称 ${key}  重复,请重新命名。`);
            }
            cacheKey.push(source[key]);
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
})();

//合并 reduers
const rootReducer = combineReducers({
  ...reducers,
  ...modelsReducers,
});

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware, ...middleware)
);
// then run the saga
sagaMiddleware.run(saga);
const allActions = checkMergeActions(actions, modelsActions, sagaActions);
export {allActions as actions};
export default store;
