const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('./config/key');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

const cors_origin = ['http://localhost:3000']; //복수의 url 가능

// 미들웨어 함수를 로딩
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded를 분석하여 가져오기 위한 설정
app.use(bodyParser.json()); //application/json을 분석하여 가져오기 위한 설정
app.use(cookieParser());
app.use(
  cors({
    origin: cors_origin, //허용하려는 request address
    credentials: true, //설정한 내용을 response 헤더에 추가
  }),
);

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected success'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req, res) => {
  res.send('테스트');
});

app.post('/api/users/register', (req, res) => {
  //회원가입 시 필요한 정보들을 client에서 가져오면 DB에 넣어준다
  const user = new User(req.body);

  //save하기전에 패스워드 암호화

  //user 모델에 저장하기 위해 save라는 mongodb의 내장함수를 이용
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post('/api/users/login', (req, res) => {
  // 1. 요청된 이메일이 db에 있는지 쿼리
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      // 일치하는 사용자가 없으면
      return res.json({
        loginSuccess: 'false',
        message: '일치하는 사용자가 없습니다.',
      });
    } else {
      // 2. 요청된 이메일이 db에 있다면 비밀번호가 일치하는지 확인.
      // User 스키마를 정의한 User.js파일(model)에 comparePassword 메소드를 만든다.
      // comparePassword 메소드의 콜백함수(인자이름 cb)가 두번째 인자로 오게 된다.
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({ loginSuccess: 'false', message: '비밀번호가 일치하지 않습니다.' });
        } else {
          // 3. 비밀번호가 일치하면 토큰 생성 (jsonwebtoken 라이브러리)
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            //400번 에러가 뜨면 에러메시지 반환
            else {
              // storage/cookie에 토큰을 저장한다
              res.cookie('x_auth', user.token).status(200).json({
                loginSuccess: 'true',
                userId: user._id,
              });
            }
          });
        }
      });
    }
  });
});

/*
   - role
   0 : 일반횐
   1 : 대빵
   2 : 운영자
 */
app.get('/api/users/auth', auth, (req, res) => {
  // 미들웨어 함수를 통과하였으면 Authentication 결과가 true
  res.status(200).json({
    _id: req.user._id, //auth 미들웨어에서 req 객체에 user값을 넣어줬기 때문에 req 객체로 접근 가능
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그인이 된 상태에서 로그아웃을 하므로 auth 미들웨어를 사용
app.get('/api/users/logout', auth, (req, res) => {
  // findByIdAndUpdate : ObejctID로 쿼리 후 업데이트하는 메소드
  // 첫번째 인자 - 쿼리할 필드 // auth 미들웨어에서 request 객체에 user데이터를 넘겨주었으므로 req.user로 꺼내쓴다.
  // 두번째 인자 - 쿼리 후 업데이트할 필드명과 값
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
