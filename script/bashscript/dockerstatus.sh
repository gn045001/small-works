#/bin/bash
#= version: 0.1, date: 20240420, Creater: jiasian.lin
#模擬客戶每天觀察的資訊並規劃每小時資料再放置個別需求的資料夾
#= version: 0.2, date: 20240406, Creater: jiasian.lin
#說明整理流程

#  pre-request
# [projDir] project
#   +-- [rawDir] raw =>DockerState.json、ComputerStart.json
#   +-- [rptDir] report 
#   +-- [tmpDir] temp 
#   +-- [logDir] log <= ./log/Summary.log 、$current_dir/log/Summary.log  


#小作品用處 監控docker 確認 docker 狀態 如果將以上作品放置 Openshift 或 k8s 運轉
#順便監控我其他關於前端後端網頁的小作品運轉狀況如果未來至 K8S 或 Openshift 時
#我的小作品下載位置
#=GitHub
#
#=https://github.com/gn045001/serve1

#=Dokcer Hub
#=https://hub.docker.com/repository/docker/gn045001/dockerstate/tags



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




#section 1:執行環境的資料夾之環境變數
HOMEDIR=/home/$USER
directory="DackerData"
hour=$(date +'%Y%m%d-%H')

echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至dockerstats/raw 要建立${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 
cp  $HOMEDIR/DackerData/raw/ComputerStart.json $HOMEDIR/dockerstats/raw/$hour-ComputerStart.json
echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至dockerstats/raw 建立完畢${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 

echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至diskrepoet/raw 要建立${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 
cp  $HOMEDIR/DackerData/raw/DiskSpace.json $HOMEDIR/diskreport/raw/$hour-DiskSpace.json
echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至diskrepoet/raw 建立完畢${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 

echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至report/raw 要建立${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 
cp  $HOMEDIR/DackerData/raw/ComputerStart.json $HOMEDIR/report/raw/$hour-ComputerStart.json
echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至report/raw 建立完畢${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 

echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至InputmemorydataMongoDB/raw 要建立${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 
cp  $HOMEDIR/DackerData/raw/ComputerStart.json $HOMEDIR/InputmemorydataMongoDB/raw/$hour-ComputerStart.json
echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至InputmemorydataMongoDB/raw 建立完畢${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log"

echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至InputCPUdataMongoDB/raw 要建立${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log" 
cp  $HOMEDIR/DackerData/raw/ComputerStart.json $HOMEDIR/InputCPUdataMongoDB/raw/$hour-ComputerStart.json
echo "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 複製資料至InputCPUdataMongoDB/raw 建立完畢${hour}-ComputerStart.json." >> "$HOMEDIR/$directory/log/Summary.log"

#section 2: 刪除檔案清理不需要的資料
echo -e "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 刪除資料" >> "$HOMEDIR/$directory/log/Summary.log" 
rm -rf  "$HOMEDIR/DackerData/raw/ComputerStart.json"
echo -e "$(date) $HOMEDIR/$directory/raw/ComputerStart.json 資料刪除完畢" >> "$HOMEDIR/$directory/log/Summary.log" 

echo -e "$(date) $HOMEDIR/$directory/raw/DiskSpace.json 刪除資料" >> "$HOMEDIR/$directory/log/Summary.log" 
rm -rf  "$HOMEDIR/DackerData/raw/DiskSpace.json"
echo -e "$(date) $HOMEDIR/$directory/raw/DiskSpace.json 資料刪除完畢" >> "$HOMEDIR/$directory/log/Summary.log"

