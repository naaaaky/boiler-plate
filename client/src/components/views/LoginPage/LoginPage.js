import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const onSubmit = (event) => {
    event.preventDefault(); //리렌더링 방지

    const param = {
      email: email,
      password: pwd,
    };

    //redux-promise와 redux-thunk module 때문에 dispatch에서 function과 promise사용이 가능하다.
    dispatch(loginUser(param)).then(res => {
      if(res.payload.loginSuccess) {
        props.history.push('/');
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <label>Password</label>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.currentTarget.value)} />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
