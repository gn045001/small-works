#!/bin/bash
cat /var/lib/kubelet/config.yaml > log/monthconfig.log
ETCDCTL_API=3 etcdctl snapshot backup -h > log/monthnapshot.log
ETCDCTL_API=3 etcdctl snapshot save 4-month/month$(date +'%m')-snapshot.db --cacert /etc/kubernetes/pki/etcd/ca.crt --cert /etc/kubernetes/pki/etcd/server.crt --key /etc/kubernetes/pki/etcd/server.key
sudo tar -zcvf 4-month/month$(date +'%m')-etcd.tar.gz /etc/kubernetes/pki/etcd
