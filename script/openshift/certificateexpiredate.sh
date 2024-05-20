#!/bin/bash
#= version: 0.1, date: 20240430, Creator: jiasian.lin
#= 用來檢查 OC 的 How to list all OpenShift TLS certificate expire date 
#= 參考網頁:https://access.redhat.com/solutions/3930291
#= OpenShift TLS證書是用於OpenShift集群中安全通信的數字證書。TLS證書用於加密和驗證網絡通信，確保通信在客戶端和伺服器之間是私密和安全的。
#= 
#= 在OpenShift中，TLS證書通常用於以下目的：
#= 
#= 對OpenShift管理控制台（Web界面）和API服務進行加密通信。
#= 保護應用程序之間的通信，例如用戶端應用程序和後端服務之間的通信。
#= 保護OpenShift路由器（Router）提供的外部訪問。
#= TLS證書由一個私鑰（Private Key）和相對應的公共證書（Public Certificate）組成。私鑰用於加密通信，而公共證書則用於驗證和解密通信。當OpenShift中的TLS證書到期時，需要更新證書以確保安全通信的持續性。

#=GitHub
#=
#=https://github.com/gn045001/serve1

#=Dokcer Hub
#=https://hub.docker.com/repository/docker/gn045001/dockerstate/tags

#=  pre-request  
#= [projDir] project
#=   +-- [rawDir] raw 
#=   +-- [rptDir] report => Ocsecrets.json
#=   +-- [tmpDir] temp => output.csv
#=   +-- [logDir] log => Summary.log

#我的小作品相關設定
#docker 
#docker stats 的相關資訊寫成JSON
#dcoker ps 的相關資訊寫成JSON
#Docker configuration in crontab -e
#確認電腦狀況
#docker shell script 進行執行狀態觀察
#* * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockdata.sh #取得docker stats 資料 ，第一步取得每分鐘的資料
#0 * * * * . ~/.bash_profile; /home/gn045001/shellscript/dockerstatus.sh #取得放置相關位置並給予 docker進行執行，第二步將資料傳出去
#openshift 的容器藉由docker確認容器狀態 
#Docker 進行 crontab -e 每小時 5分時執行以下需求
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/diskreport/raw/:/app/raw/ -v /home/gn045001/diskreport/report:/app/report diskreport #產生report
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockercpureport #產生report
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/report/raw/:/app/raw/ -v /home/gn045001/report/report:/app/report dockermemoryreport #產生report
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputcpudatamongodblog:/app/log inputcpudatamongodb   #加入至DB而已
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/inputmemorydatamongodblog:/app/log inputmemorydatamongodb  #加入至DB而已
#5 * * * * . ~/.bash_profile;docker run -v /home/gn045001/dockerstats/raw/:/app/raw/ -v /home/gn045001/dockerstats/log:/app/log dockerstats #加入至DB而已

# drawalinecpuusagechart
# docker run -p 2000:2000 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinecpuusagechart
# docker run -p 2001:2001 -v /home/gn045001/dockerstats/report/:/app/report/ -v /home/gn045001/dockerstats/log:/app/log drawalinememoryusagechart
# docker run -p 2002:2002  dockercpuinformationreport
# docker run -p 2003:2003  dockermemoryinformationreport

#section 1:description 程式變數
# line 的相關變數
TOKEN="lbz6wRQ4qvbPQIPDQHTEiCMF2THiArWr8Utvjy0ZWG2"


#section 3:取得OpenShift TLS證書相關資料
echo -e "$(date) 要取得OpenShift TLS證書  " >> "./log/Summary.log"
oc get secrets -A -o go-template='{{range .items}}{{if eq .type "kubernetes.io/tls"}}{{.metadata.namespace}}{{"\t"}}{{.metadata.name}}{{"\t"}}{{index .data "tls.crt"}}{{"\n"}}{{end}}{{end}}' | while IFS=$'\t' read -r namespace name cert; do if [ -n "$namespace" ] && [ -n "$name" ] && [ -n "$cert" ]; then expiry=$(echo "$cert" | base64 -d | openssl x509 -noout -enddate | sed 's/notAfter=#=//'); echo "{\"NAMESPACE\":\"$namespace\",\"NAME\":\"$name\",\"EXPIRY\":\"$expiry\"}"; fi; done > Ocsecrets.json
echo -e "$(date) OpenShift TLS證書以確認  " >> "./log/Summary.log"


#section 2:執行nodejs相關資料
echo -e "$(date) certificateexpiredate.js確認是否存在" >> "./log/Summary.log"
if [ ! -f "./script/certificateexpiredate.js" ]; then
    errorlog="執行OpenShift TLS證書產生CSV資料並加入至有問題需確認"
    curl -X POST \
        -H "Authorization: Bearer $TOKEN" \
        -F "message=$errorlog" \
        https://notify-api.line.me/api/notify

    echo -e "$(date)  $memoryalert 有使用量問題須告警" >> "./log/Summary.log"  
else
    echo -e "$(date) certificateexpiredate.js存在並執行OpenShift TLS證書產生CSV資料並加入至mongoDB中" >> "./log/Summary.log"
    node script/certificateexpiredate.js
    echo -e "$(date) 執行OpenShift TLS證書產生CSV資料並加入至mongoDB完畢" >> "./log/Summary.log"
fi
echo -e "$(date) certificateexpiredate.js以確認完畢" >> "./log/Summary.log"