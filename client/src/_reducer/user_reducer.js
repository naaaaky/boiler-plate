import { LOGIN_USER, REGISTER_USER } from '../_actions/types';

export default function (state = {}, action) {
  //첫번째 인자는 이전 state
  //두번째 인자는 action에서 반환된 object

  //action object의 type에 따라 store의 state에 값을 저장한다.
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
    case REGISTER_USER:
      return { ...state, register: action.payload };
    default:
      return state;
  }
}
