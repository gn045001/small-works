# serve1專案

利用 VMware 建立 Red Hat 和 OpenShift 環境，實現自動化監控機制來監控 Docker 的運行狀態與硬碟空間資訊。每分鐘收集資料並將其儲存到 MongoDB 中。該機制將以容器化形式運行在 OpenShift 的 Pod 中，進行資料整理與分析。

此自動化監控系統將利用 OpenShift 的微服務架構，確保每個服務的獨立性和可擴展性。監控容器將通過腳本每分鐘收集 Docker 容器的 CPU 和內存使用情況，並定期檢查硬碟空間。收集到的數據將首先被儲存在本地，然後通過 OpenShift 的 PV（持久卷）和 PVC（持久卷申請）機制將數據持久化到硬碟中。這樣可以確保數據的安全性和可靠性，防止數據丟失。

為了進一步增強系統的功能，可以考慮添加告警機制，當 Docker 容器的資源使用超過預設閾值時，自動觸發告警通知。告警通知可以通過 Line Notify、短信或者其他即時通訊工具發送給相關管理人員，確保問題能夠及時處理。此外，還可以設置定期生成報告功能，提供容器資源使用的歷史數據和趨勢分析，幫助優化資源配置和預防潛在問題。

該監控系統不僅能實時監控 Docker 容器的運行狀態，還能提供豐富的數據分析功能，為運維和管理決策提供有力支持。通過容器化和微服務架構，系統具備了良好的靈活性和擴展性，可以根據需求進行快速調整和擴展。這種設計理念和實現方式，不僅提高了系統的穩定性和可靠性，還有效地提升了運維效率。

將資料儲存到 MongoDB 是該監控系統的一個重要組成部分。每次收集到的 Docker 運行狀態和硬碟空間資訊都會即時存入 MongoDB 中，從而實現數據的持久化和可查詢性。這不僅便於後續的數據分析和報告生成，還能確保數據在多次讀寫和存儲過程中的一致性和完整性。MongoDB 的靈活性和高效查詢能力使其成為這種監控系統的理想選擇。

## 執行步驟
  1.建立 Red Hat 和 OpenShift 環境

    使用 VMware 建立 Red Hat 與 OpenShift 環境。
    在 Red Hat 環境中設置 Docker 並撰寫 Shell 腳本。
    在虛擬機上部署 OpenShift 環境。
  
  2.設置監控機制

    編寫 shell 腳本 dockdata.sh 和 dockerstatus.sh 來收集 Docker 的運行狀態與硬碟空間資訊。
    每分鐘執行 dockdata.sh 收集 Docker 資料，並將其儲存為 JSON 文件。
    每小時執行 dockerstatus.sh 創建資料夾（如 diskreport、report、dockerstats），並將 JSON 文件移動到相應資料夾中。

  3.將數據存儲到 MongoDB

    編寫腳本將收集到的 JSON 文件中的數據寫入 MongoDB 中，以便進行後續分析。
  
  4.容器化監控機制

    將監控腳本和相關配置打包成 Docker 映像。
    
    在 OpenShift 中創建 Pod 並運行這些容器化的監控映像，確保監控機制在 Pod 中運行。
  
  5.數據整理與分析

    編寫應用程序從 MongoDB 中提取數據，並進行整理與分析。
    
    將結果展示在 Web 界面上，方便監控和管理。
## 修改與新增部分

    利用 VMware 建立 Red Hat 和 OpenShift 環境，並實現一個自動化監控機制來監控 Docker 的運行狀態與硬碟空間資訊。
    每分鐘收集資料並將其儲存到 MongoDB 中。
    監控機制將以容器化形式運行在 OpenShift 的 Pod 中，進行資料整理與分析。
    編寫專用的監控腳本來實現數據收集和存儲，確保數據的準確性和實時性。
    在 OpenShift 中運行監控容器，實現高效的資源管理和擴展能力。
    開發前端應用程序，實時顯示 Docker 運行狀態和硬碟空間使用情況，提供便捷的監控和管理界面。
  這些步驟和新增想法可以幫助你建立一個高效的 Docker 監控系統，確保 Docker 容器的運行狀態和硬碟空間使用情況得到實時監控和管理。

## 系統設計方案

    VMware 環境: 使用 VMware 建立虛擬機運行 Red Hat 和 OpenShift。
    容器管理平台: 在 Red Hat 和 OpenShift 中部署 Docker 容器。
## 目標

建立一個每分鐘監控 Docker 運行狀態和硬碟空間資訊的自動化監控機制，並將數據儲存至 MongoDB。

## 監控機制步驟
1. 設置 VMware 環境:
  使用 VMware 創建虛擬機以運行 Red Hat 和 OpenShift。

2. 部署 Red Hat 和 OpenShift:
  使用 VMware 工具在虛擬機中部署 Red Hat 和 OpenShift。

3. 安裝和配置 Docker:
  在 Red Hat 和 OpenShift 中安裝和配置 Docker。

4. 編寫監控腳本:
  編寫一個 Shell 或 Python 腳本來監控 Docker 容器的運行狀態和硬碟空間資訊。
  使用 docker stats 和 df 命令來獲取所需數據。
  在腳本中添加代碼，將監控數據儲存到 MongoDB 中。
   
  ### Dokcer Hub 的網址
  https://hub.docker.com/repository/docker/gn045001/dockerstate/tags
  1. 設置 Cron Job:
    設置 Cron Job: 使用 crontab 設置每分鐘運行一次的監控腳本。
      dockdata.sh 每分鐘收集 Docker stats 資料
      dockerstatus.sh 每小時將資料整理並傳送
   
    1. * * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockdata.sh #取得docker stats 資料 ，第一步取得每分鐘的資料
    2. 0 * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockerstatus.sh #取得放置相關位置並給予 docker進行執行，第二步將資料傳出去
   
  使用 crontabe 設置每小時docker 運行一次資料整理腳本
  
      1. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport #產生report
      2. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport #產生report
      3. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport #產生report
      4. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
      5. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
      6. 5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已
  
  Drawalinecpuusagechart

     1. docker run -p 2000:2000 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinecpuusagechart
     2. docker run -p 2001:2001 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinememoryusagechart
     3. docker run -p 2002:2002  dockercpuinformationreport
     4. docker run -p 2003:2003  dockermemoryinformationreport

## 專案繪圖示例

![server1](https://i.imgur.com/7cbe5qJ.png)

## 繪圖的程式碼
  利用 Diagram as Code 進行繪製
  程式碼為 \temp\diagram\diagram.py
    
## 執行結果  為了有效監控 Docker 容器的運行狀態，我們需要定期收集相關的統計信息。為了實現這一目標，我們使用了兩個腳本：dockdata.sh 和 dockerstatus.sh。
  
  為了每分鐘收集一次 Docker 統計信息並將其存儲為 JSON 文件，我們可以使用一個名為 'dockdata.sh' 的 shell 腳本。該腳本定期運行，每分鐘收集 Docker 統計信息，然後將其保存為 JSON 文件。這些文件將在一小時後通過另一個腳本 'dockerstatus.sh' 創建的文件夾中組織和存儲。  
  首先，我們需要修改 'dockdata.sh' 腳本，以便它每分鐘運行一次並將結果保存為 JSON 文件。然後，我們將編寫 'dockerstatus.sh' 腳本，以在一小時後創建所需的文件夾結構。

### 收集資料

  這樣的設置可讓我們有效監控 Docker 的運行狀態和磁盤空間使用情況，並在需要時輕鬆檢視過去一小時的數據。這對於 Docker 環境的監控和管理非常有用。  
  為了實現每分鐘收集 Docker 統計信息並將其存儲為 JSON 文件的目標，我們需要修改 'dockdata.sh' 腳本，以便將 JSON 文件保存到適當的文件夾中。首先，在 'dockdata.sh' 中添加程式碼來收集 Docker 統計信息並將其轉換為 JSON 格式。  
  然後，修改程式碼以將 JSON 文件保存到指定的文件夾中。最後，在 'dockerstatus.sh' 中，我們需要添加程式碼以在一小時後創建相應的文件夾。這樣就能確保每分鐘收集到的 Docker 統計信息會在適當的時間保存在正確的文件夾中，以供稍後分析和使用。

### 個別資料夾執行各種需求
      每隔五分鐘，我們使用以下指令在Docker容器中運行特定映像檔，以生成報告：
      每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
      容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/diskreport/raw/，將 /app/report 掛載到 /home/gn045001/diskreport/report
      執行 diskreport 容器，生成報告
      5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport # 生成報告
      
      每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
      將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
      執行 dockercpureport 容器，生成報告
      5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport # 生成報告
      
      每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
      將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
      執行 dockermemoryreport 容器，生成報告
      5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport # 生成報告
      
      # 生成個別的 HTML 報告，如果執行出現問題，將通過 Line Notify 顯示警告
      # 並通過警告來確認硬碟空間或 dockdata.sh 和 dockerstatus.sh 的執行是否正常

    
    這些報告將被用於監控系統狀態。如果生成報告的過程中出現任何問題，我們將通過Line Notify進行告警通知。透過這些告警，我們可以確保硬碟空間使用正常，並且'dockdata.sh'和'dockerstatus.sh'這兩個腳本的執行也正常運作。
    在日常系統管理中，自動化程式變得越來越普遍。通過使用Docker容器和定期運行的腳本，我們可以輕鬆地生成各種報告來監控系統狀態。
    這種方式不僅提高了效率，還幫助我們及時發現並解決潛在的問題。透過Line Notify的告警通知，我們能夠第一時間得知異常情況，並迅速做出反應，保證系統的穩定運行。
    這種自動化監控方法不僅適用於個人電腦，也適用於企業級的伺服器和雲端架構。
### dockerstats資料夾執行加入至DB
     每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
     將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/dockerstats/raw/，將 /app/log 掛載到 /home/gn045001/dockerstats/inputcpudatamongodblog
     執行 inputcpudatamongodb 容器，將資料加入至 MongoDB
     4 5 * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
  
    每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
    將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/dockerstats/raw/，將 /app/log 掛載到 /home/gn045001/dockerstats/inputmemorydatamongodblog
    執行 inputmemorydatamongodb 容器，將資料加入至 MongoDB
    5 5 * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
  
    每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
    將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/dockerstats/raw/，將 /app/log 掛載到 /home/gn045001/dockerstats/log
    執行 dockerstats 容器，將資料加入至 MongoDB
    6 5 * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已
  
    每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
    將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/diskreport/raw/，將 /app/report 掛載到 /home/gn045001/diskreport/report
    執行 diskreport 容器，生成報告


### 定期監控 Docker 容器資源並加入資料庫的效率與重要性
    每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
    將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
    執行 dockercpureport 容器，生成報告
    5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport # 生成報告
    
    每小時的第 5 分鐘執行以下指令，使用 ~/.bash_profile 設定環境變數
    將容器的 /app/raw/ 掛載到本地目錄 /home/gn045001/report/raw/，將 /app/report 掛載到 /home/gn045001/report/report
    執行 dockermemoryreport 容器，生成報告
    5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport # 生成報告


    生成個別的 HTML 報告，如果執行出現問題，將通過 Line Notify 顯示警告，並通過警告來確認硬碟空間或 dockdata.sh 和 dockerstatus.sh 的執行是否正常。
    
    透過 Docker 容器定期將資料加入至資料庫，可以有效地管理和分析系統資源使用情況。設定定時任務，將容器資料掛載到本地目錄，再透過容器執行指令將資料加入至 MongoDB 資料庫。這樣的作法不僅能夠自動化資料收集和儲存，還能夠提高系統監控和資料分析的效率。透過這種方式，我們可以及時了解系統的運行狀況，並做出相應的優化和改進，從而提高系統的穩定性和效率。
    
    另一方面，定期執行容器將 Docker 監控數據加入至資料庫，可以實現對系統狀態的全面追蹤。這些數據包括 CPU 和內存使用情況等重要信息，通過將其加入至資料庫，可以方便地進行後續分析和優化。同時，定期的監控和加入至資料庫的操作，也有助於提前發現系統問題，並採取相應措施，保障系統的穩定運行。這種監控和加入至資料庫的方式，對於提高系統管理效率和確保系統安全性都具有重要意義。
    
    透過 Docker 容器定期將 MongoDB 內的 Docker CPU 與記憶體相關資料利用圖表呈現，可以直觀地了解系統的資源使用情況。設定定時任務，將容器資料掛載到本地目錄，再透過容器執行指令將資料呈現成圖表，並使用不同的埠號對應不同的資源類型，例如 CPU 使用率和記憶體使用情況等。這樣的作法不僅能夠自動化資料呈現，還能夠提高系統監控和資料分析的效率。透過這種方式，我們可以及時了解系統資源的分配情況，並做出相應的調整，從而提高系統的運行效率和穩定性。

## Openshift  自動化監控和管理證書過期狀態是確保系統安全運行
在現代 IT 環境中，自動化監控和管理證書過期狀態是確保系統安全運行的關鍵。本文將介紹如何通過一個整合 Shell 腳本和 Node.js 應用的解決方案，來自動化監控 OpenShift 證書的過期狀態，並將數據儲存到 MongoDB 中。

### 方案概述
我們的解決方案包含兩個主要部分：

  1. Shell 腳本 certificateexpiredate.sh：該腳本執行 Node.js 腳本 certificateexpiredate.js，從而生成證書過期數據並將其存儲到 MongoDB 中。
  2. Node.js 應用 openshiftreport.js：這個應用在 2005 端口運行，提供一個 web 接口，用於檢查證書是否即將過期。
  3. Shell 腳本：certificateexpiredate.sh
首先，我們需要創建一個 Shell 腳本 certificateexpiredate.sh，該腳本會執行 certificateexpiredate.js，並將結果存儲為 JSON 文件，同時將數據插入到 MongoDB 中。

在現代企業中，確保系統的穩定運行和安全性至關重要。為了實現這一目標，監控證書的有效期是不可或缺的一環。通過定期檢查和更新證書，可以避免因證書過期而導致的服務中斷或安全漏洞。

### 自動化監控過程
certificateexpiredate.sh：這是一個強大的腳本，設計用來檢查系統中所有重要證書的有效期。當腳本執行時，它會掃描指定目錄中的證書，提取它們的過期日期，並將這些信息存儲在 MongoDB 資料庫中。這樣一來，系統管理員可以方便地查詢和分析證書的有效期信息。此外，腳本還會生成一個 JSON 文件，其中包含了所有證書的詳細信息，便於後續的數據處理和報告生成。

openshiftreport.js：這是一個基於 Node.js 的應用程序，它的主要功能是提供一個 web 服務，用於展示證書的有效期信息。當應用程序啟動時，它會監聽 2005 端口，並從 MongoDB 中提取證書的有效期數據，生成一個動態報告。通過訪問該端口，系統管理員可以方便地查看所有證書的當前狀態，並及時發現即將過期的證書。這樣一來，管理員就可以提前採取措施，更新即將過期的證書，從而避免服務中斷和安全風險。

### 整合的效益
這兩個工具的結合使用，不僅提高了證書管理的效率，還增強了系統的安全性。通過自動化檢查和報告生成，系統管理員可以將更多的時間和精力投入到其他重要任務中。此外，將證書信息存儲在 MongoDB 中，還便於數據的長期存檔和歷史查詢。這樣的設計不僅提高了管理的便捷性，還為系統的持續運行提供了可靠保障。

#### 結論
certificateexpiredate.sh 和 openshiftreport.js 是兩個非常實用的工具，它們通過自動化的方式，幫助系統管理員高效地管理和監控證書的有效期。通過這樣的工具組合，企業可以大幅降低因證書過期而帶來的風險，確保系統的穩定運行和數據安全。

## JumpServer.yaml 建立一個跳板機
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: infinite-sleep-pod
    spec:
      containers:
        - name: infinite-sleep-container
          image: alpine:latest
          command: ["/bin/sh"]
          args: ["-c", "while true; do sleep 3600; done"]


## 測試作品的mogotest.yaml檔

    apiVersion: v1
    kind: Service
    metadata:
      name: nginx-service
    spec:
      selector:
        app: nginx
      ports:
        - protocol: TCP
          port: 80
          targetPort: 80
    
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name:  webservice1
      labels:
        app: nginx
    spec:
      containers:
        - name: webservice1
          image: gn045001/openshiftdata:webservice1
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: webservice2
      labels:
        app: nginx
    spec:
      containers:
        - name: webservice2
          image: gn045001/openshiftdata:webservice2
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name:  webservice3
      labels:
        app: nginx
    spec:
      containers:
        - name: webservice3
          image: gn045001/openshiftdata:webservice3test
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: mongo
      labels:
        app: nginx
    spec:
      containers:
        - name: mongo
          image: gn045001/openshiftdata:mongo

