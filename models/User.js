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
//arrow function을 사용하지 않는 이유는 this를 바인딩할 수 없기 때문에 -> arrow function을 사용하면 user객체의 정보를 가져올 수 없다.
userSchema.pre('save', function (next) {
    var user = this;

    //isModified는 mongoose 내장함수
    if (user.isModified('password')) {  //비밀번호를 바꿀때
        //비밀번호를 암호화하는 작업
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            else {
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) return next(err);
                    else {
                        user.password = hash;   //password를 hash된 password로 변경해준다.
                        next();
                    }
                });
            }
        });
    } else {
        next();
    }
});

// 사용자가 입력한 패스워드(plainPassword)와 암호화된 패스워드가 일치하는지 비교하는 함수
// 이미 암호화된 패스워드는 복호화할수 없으므로 plainPassword를 암호화하여 비교
userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 인자는 사용자가 입력한 패스워드
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb((err));
        cb(null, isMatch);  //null은 에러가 없다, isMatch는 일치여부 bool type
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };