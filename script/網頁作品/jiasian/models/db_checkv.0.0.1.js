//工具套件
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//連接mongodb
mongoose.connect('mongodb://admin:gn045001@192.168.50.115:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

//创建 Express 应用
const app = express();
const port = 3000;

//解析请求体
app.use(bodyParser.urlencoded({ extended: true }));

//定义用户模型
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

//处理登录请求
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username, password }, (err, user) => {
    if (err) {
      res.status(500).send('Internal server error');
    } else if (user) {
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

//启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
