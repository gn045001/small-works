// version: 0.1, date: 20240430, Creator: jiasian.lin

//小作品用處 監控docker 確認 docker 狀態的網頁report 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置
//GitHub
//
//https://github.com/gn045001/serve1

//Dokcer Hub
//https://hub.docker.com/repository/docker/gn045001/dockerstate/tags

//  pre-request  
// [projDir] project
//   +-- [rawDir] raw 
//   +-- [rptDir] report 
//   +-- [tmpDir] temp
//   +-- [logDir] log

// 我的小作品相關設定
// 確認電腦狀況
// docker shell script 進行執行狀態觀察
// * * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockdata.sh #取得docker stats 資料 ，第一步取得每分鐘的資料
// 0 * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockerstatus.sh #取得放置相關位置並給予 docker進行執行，第二步將資料傳出去
// openshift 的容器藉由docker確認容器狀態 
// Docker 進行 crontab -e 每小時 5分時執行以下需求
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport #產生report
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
//5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已

// drawalinecpuusagechart
// docker run -p 2000:2000 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinecpuusagechart
// docker run -p 2001:2001 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinememoryusagechart
// docker run -p 2002:2002  dockercpuinformationreport
// docker run -p 2003:2003  dockermemoryinformationreport

//   +--
//section 1:工具套件
//   +--

// 引入 Express 框架，用於建立 Web 應用程式
const express = require('express');
// 引入 Mongoose 模組，用於操作 MongoDB 數據庫
const mongoose = require('mongoose');


//   +--
//section 2:mongoDB 數據讀取
//   +--
// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@localhost:27017/');

//建立DB功能
const db = mongoose.connection;

//當連線有問題時
db.on('error', console.error.bind(console, 'connection error:'));

//如果成功會回復onnected to MongoDB
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// 定義了常數 PORT，用來指定伺服器的監聽埠號為 2003
const PORT = 2003;

//   +--
//section 3:設定資料的天數範圍
//   +--

//取七天內的資料
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//取五天內的資料
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);


//取三天內的資料
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);


//取二天內的資料
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);


//取一天內的資料
const oneDaysAgo = new Date();
oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

const app = express();

//   +--
//section 4: 定義數據
//   +--
const containerDataSchema = new mongoose.Schema({
    timestamp: String,// timestamp時間戳記，用字串表示
    container_name: String,   // container容器名稱，用字串表示
    memory_percentage: String,    // memory_percentage記憶體使用百分比，用字串表示
    memory_usage: String, //memory_usage記憶體使用量，用字串表示,
});

// 使用 mongoose.model 方法來定義一個名為 ContainerData 的資料模型，
// 並將其與資料庫中的 memories 集合關聯起來
const ContainerData = mongoose.model('memories', containerDataSchema);

//   +--
//section 5: 返回 index.html 文件
//   +--

app.get('/', (req, res) => {
    // 發送檔案至客戶端，__dirname 是目前執行的檔案所在目錄的絕對路徑
    res.sendFile(__dirname + '/dockermemoryrInformationreportindex.html');
});
//gitlab
// 一天資料回傳
app.get('/GitLaboneDaysgetData', async (req, res) => {
    try {
        // 使用 ContainerData 模型找出 container_name 為 "gitlab" 且 timestamp 大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        // 將資料以 JSON 格式回傳給客戶端
        res.json(data);
    } catch (err) {
         // 若發生錯誤，印出錯誤訊息並回傳 500 錯誤碼至客戶端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/GitLabtwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/GitLabthreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/GitLabfiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/GitLabsevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


//my-mongodb
// 一天資料回傳
app.get('/gifted_dubinskyoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/gifted_dubinskytwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/gifted_dubinskythreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/gifted_dubinskyfiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/gifted_dubinskysevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


//my-mongodb
// 一天資料回傳
app.get('/my-mongodboneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/my-mongodbtwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/my-mongodbthreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/my-mongodbfiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/my-mongodbsevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//Sonarqube
// 一天資料回傳
app.get('/SonarqubeoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/SonarqubetwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/SonarqubethreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/SonarqubefiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/SonarqubesevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


//redmine
// 一天資料回傳
app.get('/redmineoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳
app.get('/redminetwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳
app.get('/redminethreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳
app.get('/redminefiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳
app.get('/redminesevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, memory_percentage: 1,memory_usage:1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});




// 使用 app 物件的 listen 方法開始監聽指定的埠號，並在伺服器啟動後執行回調函式
app.listen(PORT, () => {
    // 在控制台輸出伺服器啟動的訊息，包含啟動的埠號
    console.log(`Server is running on port ${PORT}`);
});

