#!/bin/bash
cat /var/lib/kubelet/config.yaml > log/weekconfig.log
ETCDCTL_API=3 etcdctl snapshot backup -h > log/weeksnapshot.log
ETCDCTL_API=3 etcdctl snapshot save 3-week/week$(date +'%U')-snapshot.db --cacert /etc/kubernetes/pki/etcd/ca.crt --cert /etc/kubernetes/pki/etcd/server.crt --key /etc/kubernetes/pki/etcd/server.key
sudo tar -zcvf 3-week/week$(date +'%U')-etcd.tar.gz /etc/kubernetes/pki/etcd
