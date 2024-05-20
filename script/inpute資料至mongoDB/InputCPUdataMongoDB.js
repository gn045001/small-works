//version: 0.1, date: 20240420, Creater: jiasian.lin
//version: 0.2, date: 20240424, Creater: jiasian.lin

//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report 
//   +-- [tmpDir] temp
//   +-- [logDir] log => CPUSummer.log


//小作品用處 監控docker 確認 docker 狀態 如果將以上作品放置 Openshift 或 k8s 運轉
//順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
//我的小作品下載位置
//GitHub
//
//https://github.com/gn045001/serve1

//Dokcer Hub
//https://hub.docker.com/repository/docker/gn045001/dockerstate/tags


//我的小作品相關設定
//Docker configuration in crontab -e
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

//執行MongoDB數據庫
const mongoose = require('mongoose'); 
//讀取ComputerStart.json資料
const fs = require('fs');
//寫入至Summerlog
const Summerlog = 'log/CPUSummer.log'

//   +--
//section 2:執行環境的資料夾之環境變數
//   +--

//取得時間變數功能
const currentDate = new Date();
//讀取年份變數功能
const year = currentDate.getFullYear();
// 讀取月份變數功能並設定為兩位數
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 

// 讀取日期變數功能並設定為兩位數
const day = String(currentDate.getDate()).padStart(2, '0'); 
// 讀取小時變數功能並設定為兩位數
const hour = String(currentDate.getHours()).padStart(2, '0');
//設定時間變數給予開啟檔案的能力 
const currentDateTime = `${year}${month}${day}-${hour}`;

//   +--
//section 3:Line Notify API相關設定
//   +--

// Line Notify 功能
const querystring = require('querystring');

// Line Notify 存取權杖
const accessToken = 'lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2';

// Line Notify API 端點
const axios = require('axios');

// Line Notify URL
const url = 'https://notify-api.line.me/api/notify';


// 設定  Notify 的功能
const config = {
    headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
    }
};

// 宣告一個變數，用來表示檔案的路徑
// 這裡使用了模板字串，可以在字串中插入變數
// currentDateTime 應該是一個代表當前日期和時間的變數，用來構建檔案名稱
const filePath = `raw/${currentDateTime}-ComputerStart.json`;

//section 3:執行環境的資料夾之環境變數
if (fs.existsSync(filePath)) {

// 連接 MongoDB 數據庫
mongoose.connect('mongodb://admin:gn045001@192.168.50.115:27017/');

//建立DB功能
const db = mongoose.connection;

// docker stats CPU狀態使用率，寫進Summer log日誌
fs.appendFile(Summerlog, '可以開始寫入資料進入mongodb'+ '\n', (err) => {
    if (err) {
        console.error('寫入log日誌有問題', err);
        return;
        }
        console.log('寫入log日誌已成功寫入')
});

//當連線有問題時
db.on('error', console.error.bind(console, 'connection error:'));

//如果成功會回復onnected to MongoDB
db.once('open', function() {
    console.log('Connected to MongoDB');
});


//section 4:定義數據的模型並寫入至DB中

// 定義了一個新的 Mongoose 資料庫架構
const containerDataSchema = new mongoose.Schema({
    timestamp: String,// 表示記錄的時間戳記，以字串形式儲存
    container_id: String,// 表示容器的 ID，以字串形式儲存
    container_name: String,// 表示容器的名稱，以字串形式儲存
    cpu_percentage: String,// 表示 CPU 使用百分比，以字串形式儲存
});

//數據加入至MongoDB ，資料表CPUstats中
const ContainerData = mongoose.model('CPUstats', containerDataSchema);


//section 5:處理JSON數據

// 使用async函式來異步處理fs.readFile的結果
fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', async (err, data) => {
    // 如果有錯誤發生，輸出錯誤訊息並結束函式
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }
    // 將讀取的檔案資料依換行符號分割成陣列，並對每一行解析成JSON物件
    const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
    
    try {
        // 將 dictionaries 中的數據保存到 MongoDB 中的 ContainerData 集合中
     const result = await ContainerData.insertMany(dictionaries);
	console.log('成功保存數據到 MongoDB：',result);
    } catch (err) {
        // 如果保存數據到 MongoDB 失敗，輸出錯誤訊息
        console.error('保存數據到 MongoDB 失敗：', err);
    } finally {
        // 無論保存成功還是失敗，都會執行這個區塊，關閉數據庫連接
        mongoose.connection.close();
    }

    // docker stats CPU狀態使用率，寫進Summer log日誌
    fs.appendFile(Summerlog, '以確認CPU資料完畢寫入log日誌已成功寫入'+ '\n', (err) => {
        if (err) {
            // 如果寫入 log 檔案有問題，輸出錯誤訊息
            console.error('寫入log日誌有問題', err);
            return;
            }
            // 如果寫入 log 檔案成功，輸出成功訊息
            console.log('寫入log日誌已成功寫入')
    });
});
    }else{
// 輸出錯誤訊息，表示 ComputerStart.json 檔案不存在，無法執行 Input CPU data to MongoDB，並結束程式
        console.error('ComputerStart.json檔案不存在Input CPU data to MongoDB失敗，離開程式');
// 發送 POST 請求到 Line Notify API， 準備要發送的訊息
        const CPUMessagelog = `error ComputerStart.json 檔案不見須注意`;            
// 將訊息轉換成適合發送的格式        
        const CPUMessages = querystring.stringify({
            message: CPUMessagelog
        });
// 發送 POST 請求到 Line Notify API
        axios.post(url,CPUMessages, config)
            .then(response => {
// 輸出 Line Notify API 的回應訊息
            console.log('因為ComputerStart.json資料缺少發送訊息Line發送訊息:', response.data);
// 將訊息寫入 Summerlog 檔案
            fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
                if (err) {
                    console.error('Line發送訊息有問題', err);
                    return;
                    }
                    console.log('Line發送訊息沒問題')
                });
            })
            .catch(error => {
// 輸出發送訊息到 Line Notify API 失敗的錯誤訊息
            console.error('error ComputerStart.json 檔案不見須注意:', error.response.data);
// 將錯誤訊息寫入 Summerlog 檔案
            fs.appendFile(Summerlog, '訊息發送失敗'+ '\n', (err) => {
            if (err) {
                console.error('error ComputerStart.json 檔案不見須注意寫輸入Summerlog成功', err);
                return;
                }
                console.log('error ComputerStart.json 檔案不見須注意且寫輸入Summerlog失敗')
                });
            });  
}