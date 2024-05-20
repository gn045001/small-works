// version: 0.1, date: 20240430, Creator: jiasian.lin
// version: 0.2, date: 20240504, Creator: jiasian.lin
//當很多資料都沒呈現敏顯得波段時就很亂
// S
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
//=> Memory_GitLabdata.json ,Memory_jenkinsbdata.json ,Memory_Jenkinsdata.json ,Memory_mongodbdata.json ,Memory_redminedata.json ,Memory_sonarqubedata.json ,Summer.log
//=> Memory_GitLabdata.csv ,Memory_jenkinsbdata.csv ,Memory_Jenkinsdata.csv ,Memory_mongodbdata.csv ,Memory_redminedata.csv ,Memory_sonarqubedata.csv
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

/// 引入 Node.js 的文件系統模組，用於操作文件
const fs = require('fs');
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

//   +--
//section 3:設定資料的天數
//   +--

// 建立一個新的 Date 物件，表示目前的日期和時間
const oneDaysAgo = new Date();

// 將日期設定為一天前
oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

// 建立 Express 應用程式物件
const app = express();

//   +--
//section 4:Line Notify API相關設定
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

//設定網頁的port
const port = 2001;

//   +--
//section 5: Pathway Summerlog
//   +--

// log and report Pathway 的位置
const Summerlog = 'report/Summer.log'

//json 的位置
const GitLabreport = 'report/Memory_GitLabdata.json'
const jenkinsreport = 'report/Memory_jenkinsbdata.json'
const mongodbreport = 'report/Memory_mongodbdata.json'
const redminereport = 'report/Memory_redminedata.json'
const sonarqubereport = 'report/Memory_sonarqubedata.json'

//csv 的位置
const GitLabreportcsv = 'report/Memory_GitLabdata.csv'
const jenkinsreportcsv = 'report/Memory_jenkinsbdata.csv'
const mongodbreportcsv = 'report/Memory_mongodbdata.csv'
const redminereportcsv = 'report/Memory_redminedata.csv'
const sonarqubereportcsv = 'report/Memory_sonarqubedata.csv'

//   +--
//section 6: 定義數據
//   +-- 

// 設定mongoose 取出來值的定義 containerDataSchema 
const containerDataSchema = new mongoose.Schema({
    timestamp: String,// 定義 timestamp 欄位，型別為字串
    container_name: String,   // 定義 container_name 欄位，型別為字串
    memory_percentage: String,    // 定義 memory_percentage 欄位，型別為字串
    memory_usage: String, // 定義 memory_usage 欄位，型別為字串
});

//選擇資料庫並
const ContainerData = mongoose.model('memories', containerDataSchema);

//   +--
//section 7: 將資料回傳至 /MemoryData.html 瀏覽器中 
//   +--

// 設定當收到根路徑的 GET 請求時執行的處理函式
app.get('/', (req, res) => {

// 使用 res.sendFile() 方法回傳指定檔案至客戶端
// __dirname 是 Node.js 中的一個全域變數，代表目前執行的檔案所在的目錄路徑
// 所以這裡是指向 MemoryData.html 的完整路徑

    res.sendFile(__dirname + '/MemoryData.html');
});

// 一天資料藉由GitLaboneDaysgetDat回傳至HTML
//GitLab寫進Summer log日誌，將文字追加到指定檔案的末尾
fs.appendFile(Summerlog, `${oneDaysAgo},GitLaboneDaysgetDat要執行了`+ '\n', (err) => {
    // 如果有錯誤發生，輸出錯誤訊息並結束函式
    if (err) {
        console.error('GitLaboneDaysgetDat將要執行有問題', err);
        return;
        }
         // 如果沒有錯誤，輸出訊息表示追加成功
        console.log('GitLaboneDaysgetDat將要執行沒有問題')
});

//處理 GET 請求在網站或應用程式中    
app.get('/GitLaboneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 gitlab 且時間戳大於等於昨天的資料,選擇container_name為gitlab
        const data = await ContainerData.find({
            // 查詢 container_name 為 gitlab 且時間戳大於等於昨天的資料
            container_name: "gitlab",
            timestamp: { $gte: oneDaysAgo.toISOString() }
            // 指定回傳的欄位，只回傳 timestamp 和 memory_percentage 欄位，不回傳 _id 欄位
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        // 將所有 timestamp 存入 labels 陣列
        const labels = data.map(item => item.timestamp);
        // 將所有 memory_percentage 存入 memoryPercentages 陣列，並轉換成浮點數格式
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));

        // 將 labels 和 memoryPercentages 回傳給前端
        res.json({ labels, memoryPercentages });


        // 輸出 JSON 檔案
        fs.writeFileSync(GitLabreport, JSON.stringify(data, null, 2));
                // GitLabreport Read JSON data from file
                fs.readFile(GitLabreport, 'utf8', (err, data) => {
                    if (err) {
                    console.error('Error reading JSON file:', err);
                    return;
                    }
                
                    try {
                    // Parse JSON data
                    const jsonData = JSON.parse(data);
                
                    // Convert JSON to CSV
                    const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
                
                    // Write CSV data to a file
                    fs.writeFileSync(GitLabreportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
                
        
                    } catch (err) {
                    console.error('Error parsing JSON data:', err);
                    }
                });

    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        //Line Notify API相關設定
        //   +--
        
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })
        
        //發送 Line Notify 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log('mongoDB出問題:', response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })       
        

        //寫入Summer log日誌
        fs.appendFile(Summerlog, 'mongoDB不正常'+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        }
});

// 從資料庫查詢 container_name 為 gitlab 且時間戳大於等於昨天的資料
    fs.appendFile(Summerlog, `${oneDaysAgo},GitLaboneDaysgetDat執行完畢且正常`+ '\n', (err) => {
        if (err) {
            console.error('GitLaboneDaysgetDat將要執行有問題', err);
            return;
            }
            console.log('GitLaboneDaysgetDat將要執行沒有問題')
    });



//jenkin狀態,寫進Summer log日誌
fs.appendFile(Summerlog, `${oneDaysAgo}, jenkin狀態的mongoDB取得數據\n`, (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });      


//一天資料藉由jenkinsoneDaysgetData回傳至HTML
//處理 GET 請求在網站或應用程式中
app.get('/jenkinsoneDaysgetData', async (req, res) => {
    try {
// 從資料庫查詢 container_name 為 gifted_dubinsky 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "gifted_dubinsky",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });        

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(jenkinsreport, JSON.stringify(data, null, 2));        
        
        // jenkinreport Read JSON data from file
        fs.readFile(jenkinsreport, 'utf8', (err, data) => {
            if (err) {
            console.error('Error reading JSON file:', err);
            return;
            }
        
            try {
            // Parse JSON data
            const jsonData = JSON.parse(data);
        
            // Convert JSON to CSV
            const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
        
            // Write CSV data to a file
            fs.writeFileSync(jenkinsreportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
        

            } catch (err) {
            console.error('Error parsing JSON data:', err);
            }
        });
    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });

        //   +--
        //設定 Line Notify API 相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })

        //發送 Line Notify 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log('mongoDB出問題:', response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })       
        

        //寫進Summer log日誌
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
});

//寫進Summer log日誌
fs.appendFile(Summerlog, `${oneDaysAgo}, jenkins狀態的mongoDB取得數據\n`, (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });

//mongoDB狀態,寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });   

//一天資料藉由mongodboneDaysgetData回傳至HTM 
//處理 GET 請求在網站或應用程式中

app.get('/mongodboneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 my-mongodb 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "my-mongodb",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(mongodbreport, JSON.stringify(data, null, 2));

             // mongodbreport Read JSON data from file
             fs.readFile(mongodbreport, 'utf8', (err, data) => {
                if (err) {
                console.error('Error reading JSON file:', err);
                return;
                }
            
                try {
                // Parse JSON data
                const jsonData = JSON.parse(data);
            
                // Convert JSON to CSV
                const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
            
                // Write CSV data to a file
                fs.writeFileSync(mongodbreportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
            
    
                } catch (err) {
                console.error('Error parsing JSON data:', err);
                }
            });

    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        //Line Notify API相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })
        
        // 發送 Line Notify 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log( `${oneDaysAgo},mongoDB出問題:`, response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })       
        

        //寫進Summer log日誌
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
    
});


//寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo}, mongoDB狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });

//redmine狀態,寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},redmine狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });   


//一天資料藉由redmineoneDaysgetData回傳至HTM 
//處理 GET 請求在網站或應用程式中

app.get('/redmineoneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 some-redmine 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "some-redmine",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(redminereport, JSON.stringify(data, null, 2));

        
        // redminereport Read JSON data from file
        fs.readFile(redminereport, 'utf8', (err, data) => {
            if (err) {
            console.error('Error reading JSON file:', err);
            return;
            }
        
            try {
            // Parse JSON data
            const jsonData = JSON.parse(data);
        
            // Convert JSON to CSV
            const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
        
            // Write CSV data to a file
            fs.writeFileSync(redminereportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
        

            } catch (err) {
            console.error('Error parsing JSON data:', err);
            }
        });


    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        //Line Notify API相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })      
                
        // 發送 Line Notify 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log('mongoDB出問題:', response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })       
        

        // 寫入 Summer log 日誌
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
});

//寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},redmine狀態的 mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });

//sonarqub狀態,寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},sonarqub狀態的mongoDB取得數據`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });   


//一天資料藉由sonarqubeoneDaysgetData回傳至HTML
//處理 GET 請求在網站或應用程式中
app.get('/sonarqubeoneDaysgetData', async (req, res) => {
    try {
        // 從資料庫查詢 container_name 為 sonarqube 且時間戳大於等於昨天的資料
        const data = await ContainerData.find({
            container_name: "sonarqube",
            timestamp: { $gte: oneDaysAgo.toISOString() }
        }, { timestamp: 1, memory_percentage: 1, _id: 0 });

        // 將資料轉換為前端需要的格式
        const labels = data.map(item => item.timestamp);
        const memoryPercentages = data.map(item => parseFloat(item.memory_percentage));
        // 將資料回傳給前端
        res.json({ labels, memoryPercentages });

        // 輸出 JSON 檔案
        fs.writeFileSync(sonarqubereport, JSON.stringify(data, null, 2));

        // sonarqube Read JSON data from file
            fs.readFile(sonarqubereport, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return;
                }
                    
                try {
                // Parse JSON data
                const jsonData = JSON.parse(data);
                    
                // Convert JSON to CSV
                const csvData = jsonData.map(row => Object.values(row).join(',')).join('\n');
                    
                // Write CSV data to a file
                fs.writeFileSync(sonarqubereportcsv, Object.keys(jsonData[0]).join(',') + '\n' + csvData);
                    
            
                } catch (err) {
                console.error('Error parsing JSON data:', err);
                }
            });

    } catch (err) {
        // 如果從資料庫取得資料失敗，回傳錯誤訊息給前端
        console.error('Failed to retrieve data from MongoDB:', err);
        res.status(500).json({ error: 'Failed to retrieve data from MongoDB' });
        
        //   +--
        // 設定 Line Notify API 相關設定
        //   +--
        const memoryMessagelog = `mongoDB出問題`;            
        const memorymessages = querystring.stringify({
            message: memoryMessagelog
        })        
        
        // 發送 Line Notify 告警
        axios.post(url,memorymessages, config)
        .then(response => {
        console.log( `${oneDaysAgo},mongoDB出問題:`, response.data);
        fs.appendFile(Summerlog, 'Line發送訊息'+ '\n', (err) => {
            if (err) {
                console.error('Line發送訊息有問題', err);
                return;
                }
                console.log('Line發送訊息沒問題')
            });
        })       
        

        //寫進Summer log日誌
        fs.appendFile(Summerlog,  `${oneDaysAgo},mongoDB不正常`+ '\n', (err) => {
            if (err) {
                console.error('mongoDB不正常檔案存在但是寫入有問題', err);
                return;
                }
                console.log('mongoDB不正常檔案存在寫入沒問題')
        });
        
    }
});

//   +--
//section 8:監聽 port 3000，當伺服器啟動後輸出訊息到控制台
//   +--



// 監聽端口
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


//寫進Summer log日誌
fs.appendFile(Summerlog,  `${oneDaysAgo},已執行結束`+ '\n', (err) => {
    if (err) {
        console.error('mongoDB已執行結束存在但是寫入有問題', err);
        return;
        }
        console.log('mongoDB已執行結束寫入沒問題')
    });
