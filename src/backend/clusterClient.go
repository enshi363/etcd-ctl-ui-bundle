package main

import (
	"time"

	"go.etcd.io/etcd/clientv3"
)

func NewEtcdClient(user, password string, endpoints []string) (*clientv3.Client, error) {
	config := clientv3.Config{
		Endpoints:   endpoints,
		DialTimeout: 10 * time.Second,
	}
	if user != "" {
		config.Username = user
		config.Password = password
	}
	cli, err := clientv3.New(config)
	return cli, err
}

