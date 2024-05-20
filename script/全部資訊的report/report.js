// version: 0.1, date: 20240414, Creator: jiasian.lin
// version: 0.2, date: 20240420, Creator: jiasian.lin
// version: 0.3, date: 20240428, Creator: jiasian.lin

//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report => ${formattedDate}_output.html ,reportSummer.log,Summer.log
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
//section 2:執行環境的獲取當前時間變數
//   +--

// 獲取當前時間
const currentDate = new Date();

// 格式化日期，只取到小時，並去掉連字符和冒號
const formattedDate = currentDate.toISOString().slice(0, 13).replace(/[-T:]/g, '');

// 獲取當前年份
const year = currentDate.getFullYear();

// 讀取月份並設定為兩位數，獲取當前日期和時間並將其格式化為特定的形式。
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 

// 讀取日期並設定為兩位數，因為 JavaScript 的月份是從 0 開始計算的（0 表示一月）
//，所以需要加上 1。padStart(2, '0') 函數將月份轉換為兩位數
//，不足兩位的在前面補 0。
const day = String(currentDate.getDate()).padStart(2, '0'); 

// 讀取小時並設定為兩位數，並使用 padStart(2, '0') 函數將日期轉換為兩位數格式。
const hour = String(currentDate.getHours()).padStart(2, '0'); 
// 程式碼獲取當前日期的小時部分，並使用 padStart(2, '0') 函數將小時轉換為兩位數格式。
const currentDateTime = `${year}${month}${day}-${hour}`;

// 建立檔案名稱，使用`formattedDate`變數作為檔案名稱的一部分，並將其放在'report'資料夾下
const fileName = `report/${formattedDate}_output.html`;

//const fileName = ...; - 建立一個常數 fileName 來存放檔案名稱。
//`report/${formattedDate}_output.html` - 使用模板字串 (template literal) 來建立檔案路徑。${formattedDate} 是一個變數，用於插入格式化後的日期，_output.html 則是檔案的後綴名稱。
//report/ - 指定檔案所在的資料夾路徑。
//formattedDate - 假設這個變數是一個格式化後的日期字串，將被插入到檔案名稱中。
//_output.html - 指定檔案的名稱後綴，用來識別檔案類型。

//   +--
//section 3:執行環境的獲取生成 HTML
//   +--

// 使用fs.readFile函式讀取檔案
// 'utf8'表示將檔案以UTF-8編碼讀取
// 第二個參數是一個回調函式，當讀取完成時被呼叫
fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', (err, data) => {
    // 如果有錯誤發生，輸出錯誤訊息並結束函式
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }
    // 將讀取的檔案資料依換行符號分割成陣列，並對每一行解析成JSON物件
    const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
    // 輸出解析後的資料
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
        <h1>Container Execution Status</h1>
        <table id="Table" border="1">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Container ID</th>
                    <th>Container Name</th>
                    <th>CPU Percentage</th>
                    <th>Memory Usage</th>
                    <th>Memory Percentage</th>
                    <th>Network IO</th>
                    <th>Block IO</th>
                </tr>
            </thead>
            <tbody>
                <% dictionaries.forEach(container => { %>
                <tr>
                    <td><%= container.timestamp %></td>
                    <td><%= container.container_id %></td>
                    <td><%= container.container_name %></td>
                    <td><%= container.cpu_percentage %></td>
                    <td><%= container.memory_usage %></td>
                    <td><%= container.memory_percentage %></td>
                    <td><%= container.network_io %></td>
                    <td><%= container.block_io %></td>
                </tr>
                <% }) %>
            </tbody>
        </table>
        <h1>Container Execution CPU Memory 狀態 </h1>
        <table id="displayTable" border="1">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Container Name</th>
                    <th>CPU Percentage</th>
                    <th>Memory Usage</th>
                    <th>Memory Percentage</th>
                </tr>
            </thead>
            <tbody>
                <% dictionaries.forEach(container => { %>
                <tr>
                    <td><%= container.timestamp %></td>
                    <td><%= container.container_name %></td>
                    <td><%= container.cpu_percentage %></td>
                    <td><%= container.memory_usage %></td>
                    <td><%= container.memory_percentage %></td>
                </tr>
                <% }) %>
            </tbody>
        </table> 
        </div>
    </body>
    </html>
    `;
    // 使用 ejs 模組中的 render 函數來進行生成 HTML
    const renderedHtml = ejs.render(template, { dictionaries: dictionaries });
    // 將生成的 HTML 輸出
    console.log(renderedHtml);

    // 當按輸出report至小時
    fs.writeFile(fileName, renderedHtml, (err) => {
        if (err) {
            console.error('寫入錯誤', err);
            return;
        }
        console.log('HTML 已成功寫入');
    });
});

