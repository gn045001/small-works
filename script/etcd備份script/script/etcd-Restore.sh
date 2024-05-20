#!/bin/bash

while getopts 'd:' argv
do
case $argv in
d) dataName=$OPTARG
;;
esac
done

if [ ! $dataName ]
then
	echo -e 'no data name'
	exit -1
fi

kubectl get all > log/get-all.log
kubectl run testing-restore --image=nginx > log/get-pods.log
kubectl get pods >> log/get-pods.log

ETCDCTL_API=3 etcdctl snapshot restore -h  > log/get-podsrestore.log
name=$(cat /etc/kubernetes/manifests/etcd.yaml|grep name=|sed 's/......//')

ETCDCTL_API=3 etcdctl snapshot restore $dataname  --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key $name --data-dir=/var/lib/etcd --initial-cluster=k8s126-master=https://192.168.1.118:2380 --initial-cluster-token=etcd-cluster --initial-advertise-peer-urls=https://192.168.1.118:2380
