// version: 0.1, date: 20240506, Creator: jiasian.lin
//當很多資料都沒呈現敏顯得波段時就很亂
// 
//小作品用處 監控docker 確認 docker 狀態的網頁report 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置
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
//   +-- [logDir] log => Summer.log

//   +--
//section 1: 工具套件
//   +--

// 引入 Node.js 的文件系統模組，用於操作文件
const fs = require('fs');

// 引入 Express 框架，用於建立 Web 應用程式
const express = require('express');

// 引入 Mongoose 模組，用於操作 MongoDB 數據庫
const mongoose = require('mongoose');

// 創建 Express 應用程式實例
const app = express();

// 連接到 MongoDB 資料庫
mongoose.connect('mongodb://admin:gn045001@localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });



//   +--
//section 2: Pathway Summerlog
//   +--
// log and report Pathway 的位置
const Summerlog = 'report/Summer.log'

//   +--
//section 3:設定資料的天數
//   +--

// 取得今天的日期
const today = new Date();

// 將日期格式化為 YYYY-MM-DD
const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
//今日變數
const oneDaysAgo = new Date();

oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

//   +--
//section 4:資料庫連接
//   +--

// 定義了常數 PORT，用來指定伺服器的監聽埠號為 2004
const PORT = 2005;

// 獲取資料庫連接的狀態
const db = mongoose.connection;

// 監聽資料庫連接的錯誤事件，並輸出錯誤訊息
db.on('error', console.error.bind(console, 'Connection error:'));

// 監聽資料庫連接的一次性事件，當連接成功時輸出一條訊息
db.once('open', function () {
    console.log('Connected to MongoDB');
});

//   +--
//section 5:定義 MongoDB 中的數據模型
//   +--

// 定義 MongoDB 中的數據模型
const containerDataSchema = new mongoose.Schema({
    NAMESPACE: String, // 定義 NAMESPACE 欄位的數據類型為 String
    NAME: String,// 定義 NAME 欄位的數據類型為 String
    EXPIRY: String,// 定義 EXPIRY 欄位的數據類型為 String
});

// 創建名為 openshift 的集合（collection），使用 containerDataSchema 定義的模型結構
const ContainerData = mongoose.model('openshift', containerDataSchema);

// 設置路由，當訪問根路徑時返回 index.html 文件
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/openshiftreportindex.html');
});

// 處理 GET 請求 '/GitLaboneDaysgetData'
app.get('/GitLaboneDaysgetData', async (req, res) => {
    try {
        // 取得當前年份
        const currentYear = new Date().getFullYear();
        // 使用聚合管道進行查詢和投影操作，只返回 NAMESPACE、NAME 和 EXPIRY 欄位，並過濾符合今年的 EXPIRY
        const expiriesThisYear = await ContainerData.aggregate([
            {
                $project: {
                    _id: 0, // 排除 _id 欄位
                    NAMESPACE: 1,// 返回 NAMESPACE 欄位
                    NAME: 1,// 返回 NAME 欄位
                    EXPIRY: 1// 返回 EXPIRY 欄位
                }
            },
            {
                $match: {
                    EXPIRY: {
                        // 使用正則表達式過濾符合今年的 EXPIRY
                        $regex: new RegExp(currentYear, 'i'),
                        // 確保 EXPIRY 大於今日
                        $gt: formattedToday
                    }        
                }
            }
        ]);

        // 將 EXPIRY 中的 notAfter= 刪除
        expiriesThisYear.forEach(record => {
            record.EXPIRY = record.EXPIRY.replace('notAfter=', '');
        });
        // 返回 JSON 格式的查詢結果
        res.json(expiriesThisYear);
    } catch (err) {
        console.error('Failed to fetch data from MongoDB:', err);
        // 返回內部伺服器錯誤狀態碼及錯誤訊息
        res.status(500).send('Internal Server Error');
    }
});

// 紀錄GitLab API 的調用：在每次調用GitLab API時，都會向Summerlog日誌中添加一條記錄，記錄調用時間及操作。
fs.appendFile(Summerlog, `${oneDaysAgo},GitLaboneDaysgetDat要執行了`+ '\n', (err) => {
    if (err) {
        console.error('GitLaboneDaysgetDat將要執行有問題', err);
        return;
        }
        console.log('GitLaboneDaysgetDat將要執行沒有問題')
});



// 使用 app 物件的 listen 方法開始監聽指定的埠號，並在伺服器啟動後執行回調函式
app.listen(PORT, () => {
    // 在控制台輸出伺服器啟動的訊息，包含啟動的埠號
    console.log(`Server is running on port ${PORT}`);
});
