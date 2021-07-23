import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const onSubmit = (event) => {
    event.preventDefault(); //리렌더링 방지

    if (pwd !== confirmPwd) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const param = {
      email: email,
      name: name,
      password: pwd,
    };

    //redux-promise와 redux-thunk module 때문에 dispatch에서 function과 promise사용이 가능하다.
    dispatch(registerUser(param)).then(res => {
      if(res.payload.success) {
        alert('회원가입이 완료되었습니다.');
        props.history.push('/login');
      } else {
        alert('회원가입에 실패하였습니다.');
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <label>Name </label>
        <input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <label>Password</label>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.currentTarget.value)} />
        <label>Confirm Password</label>
        <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.currentTarget.value)} />
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default RegisterPage;
