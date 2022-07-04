
export default {
  // name: "order",
  state: {
    orderInfo: {},
    // userInfo: {},
  },
  reducers: {
    setOrderInfo(state, {payload: orderInfo}) {
      return {
        ...state,
        ...orderInfo,
      };
    },

    setOrderList(state, {payload}) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...payload,
        },
      };
    },
  },
  effects: (dispatch) => {
    return {
      // 登陆
      login(state, {payload}) {
        dispatch({
          type: "setUserInfo",
          payload: payload,
        });
      },
    };
  },
};
