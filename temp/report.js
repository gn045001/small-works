// version: 0.1, date: 20240414, Creator: jiasian.lin
const ejs = require('ejs');
const fs = require('fs');
// 獲取時間到小時
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 13).replace(/[-T:]/g, '');

//輸出Html的資料
const fileName = `report/${formattedDate}_output.html`;

// 讀取raw的JSON 文件的内容
fs.readFile('raw/ComputerStart.json', 'utf8', (err, data) => {
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
        
        <!-- CPU Percentage -->
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
        <!-- memory Percentage -->
        <h1>Container Execution memory 大於 50%須注意 </h1>
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
                    <% if (parseFloat(container.memory_percentage) > 50) { %>
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
    
    const renderedHtml = ejs.render(template, { dictionaries: dictionaries });
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

