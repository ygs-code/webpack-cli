import store from "./modelsStore";
import reduxStore from "../store";

// 注册 reducer
export const register = (rootReducer) => {
  const {
    state: initState,
    reducers = {},
    name,
    effects = () => ({}),
  } = rootReducer;

  let reducersKeys = Object.keys(reducers);
  let effectsObj = effects();

  let effectsKeys = Object.keys(effectsObj);
  return {
    name,
    //注册actions
    actions: reducersKeys.reduce((acc, key) => {
      return {
        ...acc,
        [key]: `${name}_${key}`,
      };
    }, {}),
    reducer: (state = initState, action) => {
      const {type, payload} = action;
      let fns = [];
      let code = `  switch (action.type) {`;
      for (let key of reducersKeys) {
        let modelsStore = store.get(name);
        let {dispatch: modelsStoreDispatch} = modelsStore;
        store.set(name, {
          ...modelsStore,
          dispatch: {
            ...modelsStoreDispatch,
            [key]: (dispatch, state, data) => {
              dispatch({
                type: `${name}_${key}`,
                payload: data,
              });
            },
          },
        });

        //redux 中的 reducer
        code += `
                 case '${name}_${key}':    
                 return  ${key}(state,action);
              `;

        fns.push(reducers[key]);
      }

      for (let key of effectsKeys) {
        let modelsStore = store.get(name);
        let {dispatch: modelsStoreDispatch} = modelsStore;
        store.set(name, {
          ...modelsStore,
          dispatch: {
            ...modelsStoreDispatch,
            [key]: async (dispatch, state, data) => {
              // let newDispatch = (actions) => {
              //   let { type } = actions;
              //   type = `${name}_${type}`;
              //   actions.type = type;
              //   dispatch(actions);
              // };
              //   let effectsObj = effects(newDispatch);
              // let effectsObj = effects(dispatch);
              return await effects(
                ({modelsName = "", type = "", payload = {}}) => {
                  //更改他可以传modelsName
                  dispatch({
                    type: modelsName ? `${modelsName}_${type}` : type,
                    payload,
                  });
                  return modelsName
                    ? reduxStore.getState()[modelsName]
                    : reduxStore.getState();
                }
              )[key](state, {payload: data});
            },
          },
        });
        code += `
                 case '${name}_${key}':
                 return  ${key}(state,action,${key});
              `;

        fns.push(effectsObj[key]);
      }
      code += "default:return state;}";
      return new Function(
        "state",
        "action",
        // "asyncReducer",
        ...reducersKeys,
        ...effectsKeys,
        code
      )(
        state,
        action,
        // asyncReducer,
        ...fns
      );
    },
  };
};

// 注册 reducers
export const registers = (reducers) => {
  let newReducers = {};
  //   let actions = {};
  let reducer = {};
  for (let key in reducers) {
    reducers[key].name = reducers[key].name || key;
    reducer = register(reducers[key]);
    newReducers = {
      ...newReducers,
      reducers: {
        ...(newReducers.reducers || {}),
        [reducer.name]: reducer.reducer,
      },
      actions: {
        ...(newReducers.actions || {}),
        [reducer.name]: reducer.actions,
        // ...reducer.actions,
      },
    };
  }
  return newReducers;
};
