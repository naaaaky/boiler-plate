const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

app.use(bodyParser.urlencoded({extended: true}));   //application/x-www-form-urlencoded를 분석하여 가져오기 위한 설정
app.use(bodyParser.json()); //application/json을 분석하여 가져오기 위한 설정

const mongoose = require('mongoose');
mongoose
  .connect(
    config.mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB connected success'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', (req, res) => {
  //회원가입 시 필요한 정보들을 client에서 가져오면 DB에 넣어준다
  const user = new User(req.body);

  //save하기전에 패스워드 암호화

  //user 모델에 저장하기 위해 save라는 mongodb의 내장함수를 이용
  user.save((err, userInfo) => {
      if(err) return res.json({success: false, err});
      return res.status(200).json({success: true});
  });  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});