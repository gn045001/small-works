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
