//version: 0.1, date: 20240413, Creater: jiasian.lin
//version: 0.2, date: 20240420, Creater: jiasian.lin
//新增 日期變數
//  pre-request
// [projDir] project
//   +-- [rawDir] raw <= ${currentDateTime}-ComputerStart.json
//   +-- [rptDir] report 
//   +-- [tmpDir] temp
//   +-- [logDir] log =>Summer.log 、 StatusError.log


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
// 載入 fs 模組用於讀取檔案
const fs = require('fs');

// 引入 axios 模組，用於發送 HTTP 請求
const axios = require('axios');

// 引入 querystring 模組，用於處理查詢字串
const querystring = require('querystring');

//   +--
//section 2: Pathway Summerlog
//   +--

// log and report Pathway 的位置
//log 的位置
//notebookPathErrorData
const notebookPathError = 'log/StatusError.log'
//Summerlog
const Summerlog = 'log/Summer.log'

//   +--
//section 3:Line Notify API相關設定
//   +--

// Line Notify 功能
//const querystring = require('querystring');
// Line Notify 存取權杖
//const accessToken = 'lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2';
// Line Notify API 端點
//const url = 'https://notify-api.line.me/api/notify';


//   +--
//section 4:設定資料的天數
//   +--
// 創建一個新的Date對象，它將包含當前日期和時間
const now = new Date();

// 從Date對象中獲取當前年份
const year = now.getFullYear();

// 讀取月份並設定為兩位數
const month = String(now.getMonth() + 1).padStart(2, '0'); 

// 讀取日期並設定為兩位數
const day = String(now.getDate()).padStart(2, '0'); 

// 從當前時間中取得小時數
const hour = String(now.getHours()).padStart(2, '0'); 
// 將年、月、日、小時數組合成一個格式為"年月日-小時"的字串
const currentDateTime = `${year}${month}${day}-${hour}`;
// 設定 Line Notify
// const config = {
//     headers: {
//     'Authorization': `Bearer ${accessToken}`,
//     'Content-Type': 'application/x-www-form-urlencoded'
//     }
// };

//section 2:description 讀取 JSON 文件的內容

//這行程式碼使用fs.readFile函式來讀取一個檔案。檔案路徑是raw/${currentDateTime}-ComputerStart.json，${currentDateTime}是一個變數，代表目前的日期和時間。檔案編碼使用utf8。
fs.readFile(`raw/${currentDateTime}-ComputerStart.json`, 'utf8', (err, data) => {
    if (err) {
        console.error('File exists? Confirm if the file exists at the provided path.', err);
        return;
    }

const dictionaries = data.trim().split('\n').map(line => JSON.parse(line));
console.log('解析後的陣列：', dictionaries);
dictionaries.forEach(dict => {
console.log(`Docker Container: ${dict.timestamp}，Docker Contain CPU: ${dict.cpu_percentage}%，Docker Contain Memory Usage: ${dict.memory_percentage}%`);

// docker stats CPU狀態使用率，寫進Summer log日誌
fs.appendFile(Summerlog, '開始執行確認CPU狀況寫入log日誌已成功寫入'+ '\n', (err) => {
    if (err) {
        console.error('寫入log日誌有問題', err);
        return;
        }
        console.log('寫入log日誌已成功寫入')
    });

//section 3:description 確認docker stats CPU狀態
    switch (true) {
    //判斷docker stats CPU狀態使用率
    case parseFloat(dict.cpu_percentage) < 10:
        console.log(`CPU使用率小於 10% 的容器名稱為：${dict.container_name}，CPU值$：${dict.cpu_percentage}`);
        const CPUMessagelog = `正常範圍 CPU使用率小於 10% 的容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`;

        const CPUmessages = querystring.stringify({
            message: CPUMessagelog
        });

    // 發送 POST 請求到 Line Notify API
//		axios.post(url,CPUmessages, config)
//    		.then(response => {
//        	console.log('訊息發送成功:', response.data);
//    	    })
//    		.catch(error => {
//        	console.error('訊息發送失敗:', error.response.data);
//    	    });	
	// docker stats CPU狀態使用率，寫進StatusError log日誌
        fs.appendFile(notebookPathError, CPUMessagelog+ '\n', (err) => {
            if (err) {
                console.error('寫入log日誌有問題', err);
                return;
                }
                console.log('寫入log日誌已成功寫入')
            });
                break;
    // 判斷CPU使用率
        case parseFloat(dict.cpu_percentage) >= 10 && parseFloat(dict.cpu_percentage) <= 20:
        console.log(`CPU 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
        const CPUMessagelog2 =(`CPU 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
        const CPUmessages2 = querystring.stringify({
            message: CPUMessagelog2
        });

// 發送 POST 請求到 Line Notify API
//		axios.post(url,CPUmessages2, config)
//    		.then(response => {
//       	console.log('訊息發送成功:', response.data);
//    	    })
//    		.catch(error => {
//        	console.error('訊息發送失敗:', error.response.data);
//    	    });		
    // docker stats CPU狀態使用率，寫進StatusError log日誌
            fs.appendFile(notebookPathError, CPUMessagelog2+ '\n', (err) => {
                if (err) {
                    console.error('寫入log日誌有問題', err);
                    return;
                    }
                    console.log('寫入log日誌已成功寫入')
                });
                    break;
            case parseFloat(dict.cpu_percentage) > 20 && parseFloat(dict.cpu_percentage) <= 70:
                console.log(`CPU 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUMessagelog3 =(`CPU 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUmessages3 = querystring.stringify({
                    message: CPUMessagelog3
                });
        
    // 發送 POST 請求到 Line Notify API
//                axios.post(url,CPUmessages3, config) 
//                   .then(response => {
//                 console.log('訊息發送成功:', response.data);
//                    })
//                    .catch(error => {
//                    console.error('訊息發送失敗:', error.response.data);
//                    });	
    // docker stats CPU狀態使用率，寫進StatusError log日誌        
                fs.appendFile(notebookPathError, CPUMessagelog3+ '\n', (err) => {
                    if (err) {
                        console.error('寫入log日誌有問題', err);
                        return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
        
                break;
            case parseFloat(dict.cpu_percentage) > 70:
                console.log(`CPU 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUMessagelog4 =(`CPU 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}。`);
                const CPUmessages4 = querystring.stringify({
                    message: CPUMessagelog4
                });
        
    // 發送 POST 請求到 Line Notify API
//                axios.post(url,CPUmessages4, config) 
//                   .then(response => {
//                 console.log('訊息發送成功:', response.data);
//                    })
//                    .catch(error => {
//                    console.error('訊息發送失敗:', error.response.data);
//                    });	
	// docker stats CPU狀態使用率，寫進StatusError log日誌
                fs.appendFile(notebookPathError, CPUMessagelog4+ '\n', (err) => {
                    if (err) {
                        console.error('寫入log日誌有問題', err);
                        return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
    // docker stats CPU狀態使用率，CPU使用率過高須注意，寫進Summer log日誌                
                fs.appendFile(Summerlog, 'CPU使用率過高須注意'+ '\n', (err) => {
                    if (err) {
                         console.error('寫入log日誌有問題', err);
                         return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
                break;
            default:
    // docker stats CPU狀態使用率，寫進StatusError log日誌
                fs.appendFile(Summerlog, 'memory值有問題請確認'+ '\n', (err) => {
                    if (err) {
                        console.error('寫入log日誌有問題', err);
                        return;
                        }
                        console.log('寫入log日誌已成功寫入')
                    });
                break;
        }
    // docker stats CPU狀態使用率，寫進Summer log日誌
        fs.appendFile(Summerlog, '以確認CPU完畢寫入log日誌已成功寫入'+ '\n', (err) => {
            if (err) {
                console.error('寫入log日誌有問題', err);
                return;
                }
                console.log('寫入log日誌已成功寫入')
            });


//section 4:description 確認memory狀態
        fs.appendFile(Summerlog, '開始執行確認memory狀況'+ '\n', (err) => {
            if (err) {
                console.error('寫入log日誌有問題', err);
                return;
                }
                console.log('寫入log日誌已成功寫入')
            });

         switch (true) {
            case parseFloat(dict.memory_percentage) < 10:
                console.log(`memory 使用百分比小於 10% 的容器名稱為：${dict.container_name}，memory 使用量：${dict.memory_usage}，memory值：${dict.memory_percentage}`);
                const memoryMessagelog = `正常範圍memory 使用百分比小於 10% 的容器名稱為：${dict.container_name}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`;            
                // const memorymessages = querystring.stringify({
                //     message: memoryMessagelog
                // });
            
                // 發送 POST 請求到 Line Notify API
//                    axios.post(url,memorymessages, config)
//                        .then(response => {
//                        console.log('訊息發送成功:', response.data);
//                        })
//                        .catch(error => {
//                        console.error('訊息發送失敗:', error.response.data);
//                        });	
                 // docker stats CPU狀態使用率，寫進StatusError log日誌
                    fs.appendFile(notebookPathError, memoryMessagelog+ '\n', (err) => {
                        if (err) {
                            console.error('寫入log日誌有問題', err);
                            return;
                            }
                            console.log('寫入log日誌已成功寫入')
                        });
                            break;
                case parseFloat(dict.memory_percentage) >= 10 && parseFloat(dict.memory_percentage) <= 20:
                    console.log(`memory 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                    const memoryMessagelog2 =(`memory 在 10% 至 20% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                    const memorymessages2 = querystring.stringify({
                        message: memoryMessagelog2
                    });
            
                // 發送 POST 請求到 Line Notify API
//                    axios.post(url,memorymessages2, config)
 //                       .then(response => {
 //                       console.log('訊息發送成功:', response.data);
 //                       })
 //                       .catch(error => {
 //                       console.error('訊息發送失敗:', error.response.data);
 //                       });		
                // docker stats CPU狀態使用率，寫進StatusError log日誌 
                        fs.appendFile(notebookPathError, memoryMessagelog2+ '\n', (err) => {
                            if (err) {
                                console.error('寫入log日誌有問題', err);
                                return;
                                }
                                console.log('寫入log日誌已成功寫入')
                            });
            
                                break;
                        case parseFloat(dict.memory_percentage) > 20 && parseFloat(dict.memory_percentage) <= 70:
                            console.log(`memory 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                            const memoryMessagelog3 =(`memory 在 20% 至 70% 之間，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}。`);
                            const memorymessages3 = querystring.stringify({
                                message: memoryMessagelog3
                            });
                    
                // 發送 POST 請求到 Line Notify API
//                            axios.post(url,memorymessages3, config)
//                                .then(response => {
 //                               console.log('訊息發送成功:', response.data);
 //                               })
//                                .catch(error => {
 //                               console.error('訊息發送失敗:', error.response.data);
//                                });	
                // docker stats CPU狀態使用率，寫進StatusError log日誌    
                            fs.appendFile(notebookPathError, memoryMessagelog3+ '\n', (err) => {
                                if (err) {
                                    console.error('寫入log日誌有問題', err);
                                    return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                    
                            break;
                        case parseFloat(dict.memory_percentage) > 70:
                            console.log(`memory 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}急需要注意。`);
                            const memoryMessagelog4 =(`memory 在 70% 以上了需注意，並記入時間紀錄：${dict.timestamp}，容器名稱為：${dict.container_name}，CPU使用率：${dict.cpu_percentage}，memory 使用量：${dict.memory_usage}，memory 使用百分比：${dict.memory_percentage}急需要注意。`);
                            const memorymessages4 = querystring.stringify({
                                message: memoryMessagelog4
                            });
                    
                // 發送 POST 請求到 Line Notify API
//                            axios.post(url,memorymessages4, config)
//                                .then(response => {
//                                console.log('訊息發送成功:', response.data);
//                                })
//                                .catch(error => {
//                               console.error('訊息發送失敗:', error.response.data);
//                                });	
                // docker stats CPU狀態使用率，寫進StatusError log日誌
                            fs.appendFile(notebookPathError, memoryMessagelog4+ '\n', (err) => {
                                if (err) {
                                    console.error('寫入log日誌有問題', err);
                                    return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                // docker stats CPU狀態使用率，寫進Summer log日誌
                            fs.appendFile(Summerlog, 'memory使用率過高須注意'+ '\n', (err) => {
                                if (err) {
                                     console.error('寫入log日誌有問題', err);
                                     return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                            break;
                        default:
                // docker stats CPU狀態使用率，寫進Summer log日誌  
                            fs.appendFile(Summerlog, 'memory值有問題請確認'+ '\n', (err) => {
                                if (err) {
                                    console.error('寫入log日誌有問題', err);
                                    return;
                                    }
                                    console.log('寫入log日誌已成功寫入')
                                });
                            break;
                    }
                // docker stats CPU狀態使用率，寫進Summer log日誌        
                    fs.appendFile(Summerlog, '確認memory完畢'+ '\n', (err) => {
                        if (err) {
                            console.error('寫入log日誌有問題', err);
                            return;
                            }
                            console.log('寫入log日誌已成功寫入')
                        });


    // docker stats CPU狀態使用率，寫進Summer log日誌
    fs.appendFile(Summerlog, '以確認CPU完畢寫入log日誌已成功寫入'+ '\n', (err) => {
        if (err) {
            console.error('寫入log日誌有問題', err);
            return;
            }
            console.log('寫入log日誌已成功寫入')
        });
    });
});
