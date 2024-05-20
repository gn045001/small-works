// version: 0.1, date: 20240414, Creator: jiasian.lin
// version: 0.2, date: 20240428, Creator: jiasian.lin
//判斷是否正常輸出如異常沒執行跳出告警
//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report =>${formattedDate}_memory_report.html 、 diskreportSummer.log
//   +-- [tmpDir] temp
//   +-- [logDir] log


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
//引入 ejs 模組，用於在 Node.js 中生成 HTML 模板
const ejs = require('ejs');
// 載入 fs 模組用於讀取檔案
const fs = require('fs');

//   +--
//section 2: 取得時間的變數
//   +--
//取得時間變數功能
const currentDate = new Date();
// 將當前日期轉換為 ISO 字符串，並截取前 13 個字符，然後刪除其中的破折號、T 和冒號，以獲得格式化後的日期時間字符串
const formattedDate = currentDate.toISOString().slice(0, 13).replace(/[-T:]/g, '');
//讀取年份並存入 year 變數
const year = currentDate.getFullYear();

// 讀取月份，加 1 是因為 JavaScript 中月份從 0 開始計數，然後將其轉換為兩位數字符串，不足兩位時在前面補零，存入 month 變數
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 

// 讀取日期並轉換為兩位數字符串，不足兩位時在前面補零，存入 day 變數
const day = String(currentDate.getDate()).padStart(2, '0'); 

//讀取小時並轉換為兩位數字符串，不足兩位時在前面補零，存入 hour 變數
const hour = String(currentDate.getHours()).padStart(2, '0'); 

//將年份、月份、日期和小時拼接成一個格式為 '年份月份日期-小時' 的日期時間字符串，存入 currentDateTime 變數
const currentDateTime = `${year}${month}${day}-${hour}`;

//   +--
//section 3: Pathway Summerlog
//   +--

//log 的位置
//寫入至Summerlog
const Summerlog = 'log/diskmemorySummer.log'
// 讀取raw的JSON 文件的内容
const filePath = `raw/${currentDateTime}-ComputerStart.json`;

//輸出Html的資料
const fileName = `report/${formattedDate}_memory_report.html`;

//   +--
//section 4: Line Notify API相關設定
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




if (fs.existsSync(filePath)) {
    //寫進Summer log日誌
    fs.appendFile(Summerlog, '開始整理資料'+ '\n', (err) => {
        if (err) {
            //寫至Summerlog中說明有問題還
            console.error('無法開始整理', err);
            return;
            }
            //寫至Summerlog中說明沒有問題
            console.log('開始整理diskreport資料')
        });
        console.log('ComputerStart.json檔案存在，執行確認檔案存在');
        //寫進Summer log日誌
    fs.appendFile(Summerlog, '${currentDateTime}ComputerStart.json檔案存在'+ '\n', (err) => {
        if (err) {
            console.error('${currentDateTime}-ComputerStart.json檔案存在但是寫入有問題', err);
            return;
            }
            console.log('${currentDateTime}-ComputerStart.json檔案存在寫入沒問題')
        });
    // 讀取raw的JSON 文件的内容
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('File exists? Confirm if the file exists at the provided path.', err);
            return;
        }
        const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
        console.log('解讀數據：', dictionaries);
    
    // 生成 HTML
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Container Stats</title>
        <style>
            .center {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                flex-direction: column;
            }

            #Table th, #displayTable th, #CPUTable th, #memoryTable th {
            background-color: rgba(230, 13, 67, 0.493);
                text-align: center;  /*將文字置中 */
                padding: 5px; /* 調整框框大小 */
            } 

            #Table td, #displayTable td,
            #CPUTable td, #memoryTable td {
                text-align: center; /* 將文字置中 */
                padding: 10px; /* 調整框框大小 */
            }
            
            #displayTable, #CPUTable, #memoryTable {
                width: 30%; /* 調整表格寬度 */
            }
        </style>
    </head>
    <body>
        <div class="center">
        <h1>Container Execution memory 大於 40%須注意 </h1>
        <table id="memoryTable" border="1">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Container Name</th>
                    <th>memory Percentage %</th>
                </tr>
            </thead>
            <tbody>
                <% dictionaries.forEach(container => { %>
                    <% if (parseFloat(container.memory_percentage) > 40) { %>
                        <tr>
                            <td><%= container.timestamp %></td>
                            <td><%= container.container_name %></td>
                            <td><%= container.memory_percentage %></td>
                        </tr>
                    <% } %>
                <% }) %>        
            </tbody>
        </table>      
        </div>
    </body>
    </html>
    `;
// 使用 EJS 模板引擎來渲染 HTML，將 dictionaries 這個陣列傳遞給模板 
    const renderedHtml = ejs.render(template, { dictionaries: dictionaries });
// 輸出渲染後的 HTML 內容到控制台
    console.log(renderedHtml);

// 將渲染後的 HTML 寫入檔案
// fileName 是要寫入的檔案路徑，renderedHtml 是要寫入的內容
    fs.writeFile(fileName, renderedHtml, (err) => {
        if (err) {
            // 如果寫入時發生錯誤，輸出錯誤訊息到控制台
            console.error('寫入錯誤', err);
            return;
        }
        // 如果成功寫入，輸出成功訊息到控制台
        console.log('HTML 已成功寫入');
    });
});

}else{
    // 輸出一個訊息到控制台，表示寫入記錄檔 'report/memoryMessagelog.html' 失敗
    console.log('report/memoryMessagelog.html 寫入失敗');
    // 輸出一個錯誤訊息到控制台，表示 'DiskSpace.json' 檔案不存在，程式即將結束
    console.error('DiskSpace.json檔案不存在，離開程式');
// 發送 POST 請求到 Line Notify API 的訊息，這裡是一個字串
    const memoryMessagelog = `error DiskSpace.json 檔案不見須注意`;            
    const memorymessages = querystring.stringify({
        message: memoryMessagelog
    });
    // 發送 POST 請求到 Line Notify API
    axios.post(url,memorymessages, config)
        .then(response => {
        // 請求成功時輸出成功訊息到控制台，並將回傳的資料記錄到檔案中
        console.log('因為DiskSpace.json資料缺少發送訊息Line發送訊息:', response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                // 如果寫入檔案出現錯誤，輸出錯誤訊息到控制台
                console.error('Line發送訊息有問題', err);
                return;
                }
                // 否則輸出訊息到控制台表示寫入成功
                console.log('Line發送訊息沒問題')
            });
        })
        .catch(error => {
            // 如果發送 POST 請求出現錯誤，輸出錯誤訊息到控制台
            console.error('error DiskSpace.json 檔案不見須注意:', error.response.data);
        // 使用 fs 模組來操作檔案系統
        fs.appendFile(Summerlog, '訊息發送失敗'+ '\n', (err) => {
        // 如果有錯誤，印出錯誤訊息
            if (err) {
            console.error('error DiskSpace.json 檔案不見須注意寫輸入Summerlog成功', err);
            return;
            }
            // 如果成功寫入，印出成功訊息
            console.log('error DiskSpace.json 檔案不見須注意且寫輸入Summerlog失敗')
            });
            // 結束 fs.appendFile 方法的呼叫
        });  
}
