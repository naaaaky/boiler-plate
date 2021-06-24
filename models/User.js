const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //space를 없애준다
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//user collection에 저장하기 전에 pre라는 미들웨어(몽구스에서 제공됨) 함수를 이용하여
//save 메소드 수행 시 처리할 내용을 작성
userSchema.pre('save', (next) => {
    //비밀번호를 암호화하는 작업
    // bcrypt

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };