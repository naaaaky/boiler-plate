import axios from 'axios';
import { LOGIN_USER } from './types';

export function loginUser(param) {
  // console.log(param);
  const req = axios.post('http://localhost:5000/api/users/login', param).then(res => res.data);
  
  // Reducer에게 넘겨준다.
  return {
    type: LOGIN_USER,
    payload: req,
  };
}
