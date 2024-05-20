# 我的serve1專案
建立一個監控 Docker 的自動化監控機制，利用 VMware 建立 Red Hat 和 OpenShift 環境。每分鐘監控 Docker 的運行狀態與硬碟空間資訊，並將其加入至 MongoDB 進行儲存。

## 系統設計方案
1. VMware 環境: 使用 VMware 建立虛擬機運行 Red Hat 和 OpenShift。
2. 容器管理平台: 在 Red Hat 和 OpenShift 中部署 Docker 容器。
## 目標
建立一個每分鐘監控 Docker 運行狀態和硬碟空間資訊的自動化監控機制，並將數據儲存至 MongoDB。

## 監控機制步驟
1. 設置 VMware 環境:
  使用 VMware 創建虛擬機以運行 Red Hat 和 OpenShift。

3. 部署 Red Hat 和 OpenShift:
  使用 VMware 工具在虛擬機中部署 Red Hat 和 OpenShift。

5. 安裝和配置 Docker:
  在 Red Hat 和 OpenShift 中安裝和配置 Docker。

6. 編寫監控腳本:
  編寫一個 Shell 或 Python 腳本來監控 Docker 容器的運行狀態和硬碟空間資訊。
  使用 docker stats 和 df 命令來獲取所需數據。
  在腳本中添加代碼，將監控數據儲存到 MongoDB 中。
   
  ### Dokcer Hub 的IP
  https://hub.docker.com/repository/docker/gn045001/dockerstate/tags
7. 設置 Cron Job:
  使用 crontab 設置每分鐘運行一次的監控腳本。
      docker shell script 進行執行狀態觀察
   
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

### 繪圖的程式碼
利用 Diagram as Code 進行繪製
程式碼為 \temp\diagram\diagram.py

程式碼:
    from diagrams import Diagram, Cluster, Edge
    from diagrams.onprem.ci import Jenkins
    from diagrams.onprem.client import User
    from diagrams.onprem.vcs import Github, Gitlab, Git
    from diagrams.onprem.database import Mongodb
    from diagrams.onprem.monitoring import Grafana, Prometheus
    from diagrams.alibabacloud.application import NodeJsPerformancePlatform
    from diagrams.onprem.gitops import Argocd
    from diagrams.custom import Custom
    from diagrams.onprem.network import ETCD
    
    #K8S
    from diagrams.k8s.clusterconfig import HPA
    from diagrams.k8s.compute import Deployment, Pod, ReplicaSet, StatefulSet
    from diagrams.k8s.network import Ingress, Service
    from diagrams.k8s.storage import PV, PVC, StorageClass
    
    
    #azure
    from diagrams.azure.general import Templates
    from diagrams.saas.chat import Line
    from diagrams.ibm.user import Browser
    from urllib.request import urlretrieve
    with Diagram("server_docker_資料加入_mongodb", show=False, outformat="png"):
    
        with Cluster("Service One:docker 測試環境"):
            #規劃github, gitlab的流程
    
            with Cluster("CI Continuous Integration"):
    
                   
                #規劃流程
                bastion = User("User") >> Edge(label="Input Code") >> Git("Git")  
                github = bastion >> Github("Github")
                CIpath =github >> Edge(label="Confirm the quality of the code") 
    
            with Cluster("CD Continuous Deployment"):
                
                #下載Docker圖檔
                docker_icon = "picture/docker.png"
    
                #urlretrieve(docker_url, docker1_icon) 
                # dockertemp = Custom("docker",docker_icon)
                #docker 
                docker1 = Custom("diskreport", docker_icon)
                docker1 = Custom("diskreport", docker_icon)    
                docker2 = Custom("InputCPUdataMongoDB", docker_icon)   
                docker3 = Custom("InputmemorydataMongoDB", docker_icon)   
                docker4 = Custom("Data input mongoDB", docker_icon)
    
    
                docker5 = Custom("docker", docker_icon)
    
    
                #下載Compute圖檔
                Compute_icon = "picture/compute.png"
                compute = Custom("comput state",Compute_icon)
                
    
                #規劃流程
                #定義取得資料部分
                CDpath = CIpath >> Jenkins("Jenkins")  >> Edge(label="docker 狀態") >> compute  >> Edge(label="Input Code") >> Templates("JSON")
                #加入至MongoDB資料
    
                #產生rpoert
                CDpath >> docker1 >> Edge(label="Disk 相關資料的 Report") >> Browser("Browser")
                CDpath >> docker2 >> Edge(label="Docker CPU Report") >> Browser("Browser")            
                CDpath >> docker3 >> Edge(label="Dockerstats")  >> Browser("Browser")            
                CDpath >> docker5 >> Edge(color="firebrick", style="dashed") >> Line("Line")         
    
    
                #Redhat Openshift 測試環境
        with Cluster("從自我介紹作品的網頁取得資料的 MongoDB 功能"):
            #下載Google_Chrome.png圖檔
            GoogleChrome_icon = "picture/Google_Chrome.png"
            googlechrometemp = Custom("網頁作品",GoogleChrome_icon)
            docker6 = Custom("CPUData", docker_icon)
            docker7 = Custom("MemoryData", docker_icon)
            docker8 = Custom("dockerCPUInformationreportindex", docker_icon)
            docker9 = Custom("dockermemoryrInformationreportindex", docker_icon)
            DBpath = CDpath >> docker4 >> Edge(label="Docker Memory Report 、 Input CPU data Mongodb log  、Input Memory data Mongodb log ")  >> Mongodb("Mongodb")
            DBpath >> docker6 >> Browser("Browser") >> googlechrometemp
            DBpath >> docker7  >> Browser("Browser") >>  googlechrometemp
            DBpath >> docker8 >> Browser("Browser") >> googlechrometemp
            DBpath >> docker9 >>  Browser("Browser") >> googlechrometemp
            
        with Cluster("Redhat Openshift 正式環境"):
            #下載Openshift.png圖檔
            Openshift_icon = "picture/OpenShift.png"
            Openshift = Custom("Openshift",Openshift_icon)
    
            #下載測試環境圖檔
            GoogleChrome_icon = "picture/Google_Chrome.png"
            #下載測試環境圖檔
            OpenshiftPath = CDpath >>Openshift    
            #產生rpoert
            OpenshiftPath >> Pod("diskreport") >> Edge(label="Disk 相關資料的 Report") >> Browser("Browser")
            OpenshiftPath >> Pod("InputCPUdataMongoDB") >> Edge(label="Docker CPU Report") >> Browser("Browser")
            OpenshiftPath >> Pod("InputmemorydataMongoDB") >> Edge(label="Dockerstats")  >> Browser("Browser")
            OpenshiftPath >> Pod("pod") >> Edge(color="firebrick", style="dashed") >> Line("Line")
            mongoDBOpenshift = OpenshiftPath >> Pod("Data input mongoDB")>> Edge(label="Docker Memory Report 、 Input CPU data Mongodb log  、Input Memory data Mongodb log ")
        with Cluster("Redhat Openshift 正式環境mongoDB"):
            googlechrometemp = Custom("網頁作品",GoogleChrome_icon)
            OpenshifmongoDB = mongoDBOpenshift >> Mongodb("Mongodb")
            OpenshifmongoDB >> Pod("CPUData") >> Edge(label="") >> Browser("Browser") >> googlechrometemp
            OpenshifmongoDB >> Pod("MemoryData") >> Browser("Browser") >> googlechrometemp
            OpenshifmongoDB >> Pod("dockerCPUInformationreportindex") >> Browser("Browser") >> googlechrometemp
            OpenshifmongoDB >> Pod("dockermemoryrInformationreportindex") >> Browser("Browser") >> googlechrometemp  
    

## 執行結果

### 收集資料
為了有效監控 Docker 容器的運行狀態，我們需要定期收集相關的統計信息。為了實現這一目標，我們使用了兩個腳本：dockdata.sh 和 dockerstatus.sh。

為了每分鐘收集一次 Docker 統計信息並將其存儲為 JSON 文件，我們可以使用一個名為 'dockdata.sh' 的 shell 腳本。該腳本定期運行，每分鐘收集 Docker 統計信息，然後將其保存為 JSON 文件。這些文件將在一小時後通過另一個腳本 'dockerstatus.sh' 創建的文件夾中組織和存儲。

首先，我們需要修改 'dockdata.sh' 腳本，以便它每分鐘運行一次並將結果保存為 JSON 文件。然後，我們將編寫 'dockerstatus.sh' 腳本，以在一小時後創建所需的文件夾結構。

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

方案概述
我們的解決方案包含兩個主要部分：

Shell 腳本 certificateexpiredate.sh：該腳本執行 Node.js 腳本 certificateexpiredate.js，從而生成證書過期數據並將其存儲到 MongoDB 中。
Node.js 應用 openshiftreport.js：這個應用在 2005 端口運行，提供一個 web 接口，用於檢查證書是否即將過期。
Shell 腳本：certificateexpiredate.sh
首先，我們需要創建一個 Shell 腳本 certificateexpiredate.sh，該腳本會執行 certificateexpiredate.js，並將結果存儲為 JSON 文件，同時將數據插入到 MongoDB 中。

在現代企業中，確保系統的穩定運行和安全性至關重要。為了實現這一目標，監控證書的有效期是不可或缺的一環。通過定期檢查和更新證書，可以避免因證書過期而導致的服務中斷或安全漏洞。

自動化監控過程
certificateexpiredate.sh：這是一個強大的腳本，設計用來檢查系統中所有重要證書的有效期。當腳本執行時，它會掃描指定目錄中的證書，提取它們的過期日期，並將這些信息存儲在 MongoDB 資料庫中。這樣一來，系統管理員可以方便地查詢和分析證書的有效期信息。此外，腳本還會生成一個 JSON 文件，其中包含了所有證書的詳細信息，便於後續的數據處理和報告生成。

openshiftreport.js：這是一個基於 Node.js 的應用程序，它的主要功能是提供一個 web 服務，用於展示證書的有效期信息。當應用程序啟動時，它會監聽 2005 端口，並從 MongoDB 中提取證書的有效期數據，生成一個動態報告。通過訪問該端口，系統管理員可以方便地查看所有證書的當前狀態，並及時發現即將過期的證書。這樣一來，管理員就可以提前採取措施，更新即將過期的證書，從而避免服務中斷和安全風險。

整合的效益
這兩個工具的結合使用，不僅提高了證書管理的效率，還增強了系統的安全性。通過自動化檢查和報告生成，系統管理員可以將更多的時間和精力投入到其他重要任務中。此外，將證書信息存儲在 MongoDB 中，還便於數據的長期存檔和歷史查詢。這樣的設計不僅提高了管理的便捷性，還為系統的持續運行提供了可靠保障。

結論
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

