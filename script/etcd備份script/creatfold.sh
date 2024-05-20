#!/bin/bash

#= version: 0.1, date: 202405011, Creater: jiasian.lin
#= 規劃 ETCD 備份的相關流程與建立資料夾
#= 規劃每小時、每天、每周、每月備份必記錄流程
#= 

#  pre-request
# [projDir] etcd
#   +-- [1-hoursDir] 1-hours 
#   +-- [2-dayDir] 2-day 
#   +-- [3-weekDir] 3-week 
#   +-- [4-monthDir] 4-month  
#   +-- [scriptDir] script
#   +-- [tmpDir] temp =>
#   +-- [logDir] log => ./log/SettingSummary.log

#小作品用處 監控docker 確認 docker 狀態 如果將以上作品放置 Openshift 或 k8s 運轉
#順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
#我的小作品下載位置
#GitHub
#=https://github.com/gn045001/serve1

#Dokcer Hub
#= https://hub.docker.com/repository/docker/gn045001/dockerstate/tags
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

# openshift 進行執行
# 進行備份 etcd 與規劃的建立資料夾
# 建立 etcd/log 資料夾
mkdir -p etcd/log
echo -e "$(date) $(pwd) 建立 etcd/log 資料夾" >> "$current_dir/etcd/log/SettingSummary.log"

# 建立 etcd/1-hours 資料夾
mkdir -p etcd/1-hours
echo -e "$(date) $(pwd) 建立 etcd/1-hours 資料夾" >> "$current_dir/etcd/log/SettingSummary.log"

# 建立 etcd/2-day 資料夾
mkdir -p etcd/2-day
echo -e "$(date) $(pwd) 建立 etcd/2-day 資料夾" >> "$current_dir/etcd/log/SettingSummary.log"

# 建立 etcd/3-week 資料夾
mkdir -p etcd/3-week
echo -e "$(date) $(pwd) 建立 etcd/3-week 資料夾" >> "$current_dir/etcd/log/SettingSummary.log"

# 建立 etcd/4-month 資料夾
mkdir -p etcd/4-month
echo -e "$(date) $(pwd) 建立 etcd/4-month 資料夾" >> "$current_dir/etcd/log/SettingSummary.log"

# 建立 etcd/script 資料夾
mkdir -p etcd/script
echo -e "$(date) $(pwd) 建立 etcd/script 資料夾" >> "$current_dir/etcd/log/SettingSummary.log"

# 建立 etcd/temp 資料夾
mkdir -p etcd/temp
echo -e "$(date) $(pwd) 建立 etcd/temp 資料夾" >> "$current_dir/etcd/log/SettingSummary.log"
