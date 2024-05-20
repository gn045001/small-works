#!/bin/bash
cat /var/lib/kubelet/config.yaml > log/config.log
ETCDCTL_API=3 etcdctl snapshot backup -h > log/snapshot.log
ETCDCTL_API=3 etcdctl snapshot save 1-hours/Hours$(date +'%H')-snapshot.db --cacert /etc/kubernetes/pki/etcd/ca.crt --cert /etc/kubernetes/pki/etcd/server.crt --key /etc/kubernetes/pki/etcd/server.key
sudo tar -zcvf 1-hours/Hours$(date +'%H')-etcd.tar.gz /etc/kubernetes/pki/etcd
