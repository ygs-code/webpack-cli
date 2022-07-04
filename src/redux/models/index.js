import * as reducers from './reducers';
import {register, registers} from './register';

//注册 reducers
const {reducers: newReducers, actions} = registers(reducers);

export {register, registers, actions};
export default newReducers;
