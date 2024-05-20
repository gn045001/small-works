// version: 0.1, date: 20240414, Creator: jiasian.lin
// version: 0.2, date: 20240420, Creator: jiasian.lin
// Adding features for Docker usage
// Alert for checking if the file exists
// version: 0.3, date: 20240427, Creator: jiasian.lin
//判斷是否正常輸出如異常沒執行跳出告警
//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report =>${formattedDate}_CPUMessagelog.html 、 diskreportSummer.log
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
//section 1: 工具套件
//   +--

//引入 ejs 模組，用於在 Node.js 中生成 HTML 模板
const ejs = require('ejs');
// 載入 fs 模組用於讀取檔案
const fs = require('fs');
//寫入至Summerlog
const Summerlog = 'log/diskCPUSummer.log'

//   +--
//section 2: 取得時間的變數
//   +--

// 建立一個新的Date物件，代表當前時間
const currentDate = new Date();

// 將當前時間格式化為ISO 8601的日期時間格式（例如：2024-05-07T15:00:00.000Z），
// 然後取得前13個字元（年、月、日、小時），並移除其中的"-"、":"和"T"字元，得到一個純數字的日期時間字串
const formattedDate = currentDate.toISOString().slice(0, 13).replace(/[-T:]/g, '');

// 取得當前年份的四位數字
const year = currentDate.getFullYear();

// 取得當前月份的數字（從0開始，所以需要+1），然後將其轉換為兩位數的字串
const month = String(currentDate.getMonth() + 1).padStart(2, '0');

// 取得當前日期的數字，然後將其轉換為兩位數的字串
const day = String(currentDate.getDate()).padStart(2, '0');

// 取得當前小時的數字，然後將其轉換為兩位數的字串
const hour = String(currentDate.getHours()).padStart(2, '0');

// 將年、月、日、小時組合成一個日期時間字串
const currentDateTime = `${year}${month}${day}-${hour}`;


//   +--
//section 3: 產生HTML 存至 report/${formattedDate}_CPU_report.html
//   +--
//輸出Html的資料
const fileName = `report/${formattedDate}_CPU_report.html`;

//   +--
//section 4: Line Notify 相關功能
//   +--

// Line Notify 功能
const querystring = require('querystring');
// Line Notify 存取權杖
const accessToken = 'lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2';
// Line Notify API 端點
const axios = require('axios');
const url = 'https://notify-api.line.me/api/notify';

// 設定  Notify 的功能
const config = {
    headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/x-www-form-urlencoded'
    }
};


//   +--
//section 5: 輸出HTML資料
//   +--
// 讀取raw的JSON 文件的内容
const filePath = `raw/${currentDateTime}-ComputerStart.json`;

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
    fs.appendFile(Summerlog, `${currentDateTime}-ComputerStart.json檔案存在`+ '\n', (err) => {
        if (err) {
            console.error(`${currentDateTime}-ComputerStart.json檔案存在但是寫入有問題`, err);
            return;
            }
            console.log(`${currentDateTime}-ComputerStart.json檔案存在寫入沒問題`)
        });


// 使用fs.readFile函式讀取檔案
// 'utf8'表示將檔案以UTF-8編碼讀取
// 第二個參數是一個回調函式，當讀取完成時被呼叫，並傳遞可能的錯誤和讀取到的資料
    fs.readFile(filePath, 'utf8', (err, data) => {
        // 如果有錯誤發生，輸出錯誤訊息並結束函式
        if (err) {
            console.error('File exists? Confirm if the file exists at the provided path.', err);
            return;
        }
        // 將讀取的檔案資料去除頭尾空白後，以換行符號分割成陣列，並對每一行解析成JSON物件
        const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
        //console.log('解讀數據：', dictionaries);
        
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
            <h1>Container Execution CPU 大於 50%須注意 </h1>
            <table id="CPUTable" border="1">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Container Name</th>
                        <th>CPU Percentage %</th>
                    </tr>
                </thead>
                <tbody>
                    <% dictionaries.forEach(container => { %>
                        <% if (parseFloat(container.cpu_percentage) > 50) { %>
                            <tr>
                                <td><%= container.timestamp %></td>
                                <td><%= container.container_name %></td>
                                <td><%= container.cpu_percentage %></td>
                            </tr>
                        <% } %>
                    <% }) %>        
                </tbody>
            </table>      
            </div>
        </body>
        </html>
        `;
        // 使用 ejs 模組的 render 函數將模板(template)與數據({ dictionaries: dictionaries })合併生成 HTML 字符串
        const renderedHtml = ejs.render(template, { dictionaries: dictionaries });
        // 將生成的 HTML 字符串輸出到控制台
        //console.log(renderedHtml);
    
        // 當按輸出report至小時
        fs.writeFile(fileName, renderedHtml, (err) => {
            if (err) {
                console.error('寫入錯誤', err);
                return;
            }
            console.log('HTML 已成功寫入');
        });
    });


}else{
// 輸出錯誤訊息，表示寫入 CPUMessagelog.html 檔案失敗
    console.log('report/CPUMessagelog.html 寫入失敗');

// 輸出錯誤訊息，表示 ComputerStart.json 檔案不存在，無法執行 CPUMessagelog 寫入，並結束程式
    console.error('ComputerStart.json檔案不存在CPUMessagelog失敗，離開程式');

// 發送 POST 請求到 Line Notify API，準備要發送的訊息
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