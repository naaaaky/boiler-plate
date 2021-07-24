import axios from 'axios';
import { LOGIN_USER, REGISTER_USER } from './types';
import { API_ADDRESS } from '../constants';

export function loginUser(param) {
  // console.log(param);
  const req = axios.post(`${API_ADDRESS}/api/users/login`, param).then(res => res.data);
  
  // Reducer에게 넘겨준다.
  return {
    type: LOGIN_USER,
    payload: req,
  };
}

export function registerUser(param) {
  const req = axios.post(`${API_ADDRESS}/api/users/register`, param).then(res => res.data);

  return {
    type:REGISTER_USER,
    payload: req,

  };
}
