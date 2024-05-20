#!/bin/bash
cat /var/lib/kubelet/config.yaml > log/dayconfig.log
ETCDCTL_API=3 etcdctl snapshot backup -h > log/daysnapshot.log
ETCDCTL_API=3 etcdctl snapshot save 2-day/$(date +'%A')-snapshot.db --cacert /etc/kubernetes/pki/etcd/ca.crt --cert /etc/kubernetes/pki/etcd/server.crt --key /etc/kubernetes/pki/etcd/server.key
sudo tar -zcvf 2-day/$(date +'%A')-etcd.tar.gz /etc/kubernetes/pki/etcd
