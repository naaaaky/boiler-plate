const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
//arrow function을 사용하지 않는 이유는 this를 바인딩할 수 없기 때문에 -> arrow function을 사용하면 user객체의 정보를 가져올 수 없다.
userSchema.pre('save', function (next) {
  var user = this;

  //isModified는 mongoose 내장함수
  if (user.isModified('password')) {
    //비밀번호를 바꿀때
    //비밀번호를 암호화하는 작업
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      else {
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
          else {
            user.password = hash; //password를 hash된 password로 변경해준다.
            next();
          }
        });
      }
    });
  } else {
    //비밀번호 이외의 정보를 변경할때
    next();
  }
});

// 사용자가 입력한 패스워드(plainPassword)와 암호화된 패스워드가 일치하는지 비교하는 메소드
// 이미 암호화된 패스워드는 복호화할수 없으므로 plainPassword를 암호화하여 비교
// 아래에서 정의한 comparePassword라는 인스턴스 메소드에서 this는 데이터 인스턴스를 가르킨다.
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 인자는 사용자가 입력한 패스워드
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch); //null은 에러가 없다, isMatch는 일치여부 bool type
  });
};

userSchema.methods.generateToken = function (cb) {
  // 객체 안에서 선언된 함수의 this는 User 객체가 아닌 window 객체를 바라보고 있기 때문에
  // this를 user 변수 안에 담아준다. (es6 이전에만 해당됨)
  var user = this;

  // jsonwebtoken을 이용하여 token 생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  // User 콜렉션에 토큰을 저장하기 위해 save 메소드를 호출
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // 토큰을 가져와서 복호화
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 사용자 id로 사용자를 찾은 후 클라이언트단(cookie)의 token과 서버단(DB)의 token이 일치하는지 확인
    // findOne 메소드의 첫번째 인자는 query (decoded가 undefined type으로 나와서 안씀)
    // 두번째 인자는 반환하려는 필드
    user.findOne({ token: token }, function (err, user) {
      if (err) return cb(err);
      else cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
