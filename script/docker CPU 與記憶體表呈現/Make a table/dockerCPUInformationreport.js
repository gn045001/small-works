// version: 0.1, date: 20240430, Creator: jiasian.lin

//小作品用處 監控docker 確認 docker 狀態 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置

//  pre-request  
// [projDir] project
//   +-- [rawDir] raw 
//   +-- [rptDir] report 
//   +-- [tmpDir] temp
//   +-- [logDir] log

//GitHub
//
//https://github.com/gn045001/serve1

//Dokcer Hub
//https://hub.docker.com/repository/docker/gn045001/dockerstate/tags



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

//工具套件
// 引入 Express 框架，用於建立 Web 應用程式
const express = require('express');

// 引入 Mongoose 模組，用於操作 MongoDB 數據庫
const mongoose = require('mongoose');


//   +--
//section 2:mongoDB 數據讀取
//   +--

// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@192.168.50.115:27017/');

//建立DB功能
const db = mongoose.connection;

//當連線有問題時
db.on('error', console.error.bind(console, 'connection error:'));

//如果成功會回復onnected to MongoDB
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// 定義了常數 PORT，用來指定伺服器的監聽埠號為 2002
const PORT = 2002;


//   +--
//section 3:設定資料的天數
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
    timestamp: String,// 定義 timestamp 欄位，型別為字串
    container_name: String,// 定義 container_name 欄位，型別為字串
    cpu_percentage: String,// 定義 cpu_percentage 欄位，型別為字串
});
// 選擇要操作的資料庫集合（collection），並指定集合名稱為 'cpustats'，使用之前定義的 containerDataSchema 作為模型結構
 const ContainerData = mongoose.model('cpustats', containerDataSchema);


 //   +--
//section 5: 返回 index.html 文件
//   +--

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dockerCPUInformationreportindex.html');
});

//GitLaboneDaysgetData 
//一天資料回傳至前端
app.get('/GitLaboneDaysgetData', async (req, res) => {
    try {
         // 從資料庫查詢 container_name 為 gitlab 且時間戳大於等於昨天的資料,選擇container_name為gitlab
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
         // 將查詢到的資料以 JSON 格式回傳給客戶端
        res.json(data);
    } catch (err) {
        // 如果查詢過程中發生錯誤，捕獲並記錄錯誤訊息到控制台，然後回傳一個內部伺服器錯誤給客戶端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//二天資料回傳至前端
app.get('/GitLabtwoDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: twoDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//三天資料回傳至前端
app.get('/GitLabthreeDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: threeDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//五天資料回傳至前端
app.get('/GitLabfiveDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: fiveDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});

//七天資料回傳至前端
app.get('/GitLabsevenDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gitlab",
            timestamp: { $gte: sevenDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
        res.json(data);
    } catch (err) {
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
    }
});


//Jenkins
// 一天資料回傳至前端
app.get('/gifted_dubinskyoneDaysgetData', async (req, res) => {
    try {
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
        }, { timestamp: 1, container_name: 1, cpu_percentage: 1, _id: 0 });
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
