//GitHub

//Dokcer Hub


//  pre-request  
// [projDir] project
//   +-- [rawDir] raw 
//   +-- [rptDir] report 
// => CPU_GitLabdata.json ,CPU_jenkinsbdata.json ,CPU_Jenkinsdata.json ,CPU_mongodbdata.json ,CPU_redminedata.json ,CPU_sonarqubedata.json ,Summer.log
// => CPU_GitLabdata.csv ,CPU_jenkinsbdata.csv ,CPU_Jenkinsdata.csv ,CPU_mongodbdata.csv ,CPU_redminedata.csv ,CPU_sonarqubedata.csv 
//   +-- [tmpDir] temp
//   +-- [logDir] log => Summer.log


//   +--
//section 1:工具套件
//   +--

//工具套件
const mongoose = require('mongoose');
//   +--
//section 2:定義資料mongoDB 
//   +--
//連接mongodb
mongoose.connect('mongodb://admin:gn045001@192.168.50.115:27017/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});


//   +--
//section 3:mongoDB 
//   +--

const containerDataSchema = new mongoose.Schema({

    username: String,
    password: String,
    dbname: String,
});

//選擇資料庫並
const ContainerData = mongoose.model('userpassword', containerDataSchema);