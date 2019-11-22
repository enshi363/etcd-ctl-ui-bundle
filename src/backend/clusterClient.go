package main

import (
	"context"
	"fmt"
	"go.etcd.io/etcd/clientv3"
	"log"
	"time"
)

func NewEtcdClient(user, password string) (*clientv3.Client, error) {
	cli, err := clientv3.New(clientv3.Config{
		Endpoints:   Env.GetEndPoints(),
		DialTimeout: 10 * time.Second,
		Username:    user,
		Password:    password,
	})
	return cli, err
}

func Connect(user string, password string) *clientv3.Client {
	cli, err := clientv3.New(clientv3.Config{
		Endpoints:   Env.GetEndPoints(),
		DialTimeout: 10 * time.Second,
		Username:    user,
		Password:    password,
	})
	if err != nil {
		log.Fatal(err)
	}
	defer cli.Close()

	resp, err := cli.MemberList(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("members:", len(resp.Members))
	return cli
}
