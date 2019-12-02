package main

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.etcd.io/etcd/clientv3"
)

func (handler *httpHanlder) ClusterMembers(c *gin.Context) {
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	resp, err := cli.MemberList(context.Background())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"members": resp.Members})
}

func (handler *httpHanlder) ClusterAuthEnable(c *gin.Context) {
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	_, err := cli.AuthEnable(context.Background())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) ClusterAuthDisable(c *gin.Context) {
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	_, err := cli.AuthDisable(context.Background())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}
