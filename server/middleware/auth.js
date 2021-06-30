const { User } = require('../models/User');

let auth = (req, res, next) => {
  // 인증처리

  // 1. 클라이언트단의 쿠키에서 토큰을 가져온다. (cookie-parser 사용)
  let token = req.cookies.x_auth; // 쿠키 상에서 x_auth라는 name을 가진 데이터를 가져온다.

  // 2. 토큰을 복호화한 후 사용자 찾기
  // User model에서 메소드를 만들어준다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    // 일치하는 사용자가 없으면 아래의 json object를 반환
    if (!user) return res.json({ isAuth: false, error: true });

    // 엔드포인트(라우터)에서 사용하기 위해 request에 token과 user값을 넣어준다
    req.token = token;
    req.user = user;
    next(); //next()를 사용하여 미들웨어 함수가 끝나면 벗어나서 콜백함수 ㄱ
  });

  // 3. 사용자가 있으면 인증 성공
  // 4. 사용자가 존재하지 않으면 인증 실패
};

module.exports = { auth };
