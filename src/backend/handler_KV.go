package main

import (
	"context"
	"fmt"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.etcd.io/etcd/clientv3"
)

// Binding from JSON
type PutData struct {
	Key     string `form:"key" json:"key" xml:"key"  binding:"required"`
	Content string `form:"content" json:"content" xml:"content"  binding:"required"`
	TTL     int64  `form:"ttl" json:"ttl" xml:"ttl" `
}

func (handler *httpHanlder) PutConfig(c *gin.Context) {
	var data PutData
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	_, err = cli.Put(ctx, data.Key, data.Content)
	cancel()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) RemoveConfig(c *gin.Context) {
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	_, err = cli.Delete(ctx, c.Param("key"), clientv3.WithPrefix())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) GetConfigList(c *gin.Context) {
	prefix := c.DefaultQuery("prefix", "")
	limit := Env.GetMaxLimit()

	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	resp, err := cli.Get(ctx, prefix, clientv3.WithKeysOnly(), clientv3.WithPrefix(), clientv3.WithLimit(int64(limit)), clientv3.WithSort(clientv3.SortByKey, clientv3.SortDescend))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := []string{}
	for _, k := range resp.Kvs {
		dir, file := path.Split(string(k.Key))
		fmt.Println(dir, file)
		if file != "" && strings.HasPrefix(dir, prefix) {
			result = append(result, file)
		}
		p := strings.TrimPrefix(dir, prefix)
		if strings.HasSuffix(dir, "/") && strings.Count(p, "/") == 1 {
			result = append(result, p)
		}
	}
	//data, _ := json.Marshal(resp)
	c.JSON(http.StatusOK, gin.H{"data": (result)})
}
