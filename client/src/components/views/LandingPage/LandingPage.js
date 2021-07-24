import React, { useEffect } from 'react';
import axios from 'axios';
import {API_ADDRESS} from '../../../constants';

function LandingPage(props) {
  useEffect(() => {
    axios.get(`${API_ADDRESS}/api/hello`).then((res) => {});
  }, []);

  const logoutHandler = () => {
    axios.get(`${API_ADDRESS}/api/users/logout`).then(res => {
      if(res.data.success) {
        props.history.push('/login');
      } else {
        alert('로그아웃 실패');
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <h2>시작 페이지</h2>

      <button onClick={logoutHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
