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
	opts := []clientv3.OpOption{}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	if data.TTL > 0 {
		if resp, err := cli.Grant(context.TODO(), data.TTL); err == nil {
			opts = append(opts, clientv3.WithLease(resp.ID))
		}
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	_, err := cli.Put(ctx, data.Key, data.Content, opts...)
	cancel()
	if err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) RemoveConfig(c *gin.Context) {
	//cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	//if err != nil {
	//c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	//return
	//}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	fmt.Sprintln(c.Param("key"))
	_, err := cli.Delete(ctx, c.Param("key"), clientv3.WithPrefix())

	if err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) GetConfigList(c *gin.Context) {
	prefix := c.DefaultQuery("prefix", "")
	limit := Env.GetMaxLimit()
	opts := []clientv3.OpOption{}
	opts = append(opts, clientv3.WithPrefix(), clientv3.WithSerializable(), clientv3.WithKeysOnly())
	if limit > 0 {
		opts = append(opts, clientv3.WithLimit(limit))
	}

	//cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	//if err != nil {
	//c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	//return
	//}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	resp, err := cli.Get(ctx, prefix, opts...)
	if err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := []string{}
	dirMap := map[string]bool{}
	prefix, _ = path.Split(prefix)
	for _, k := range resp.Kvs {
		dir, file := path.Split(string(k.Key))
		//fmt.Println(dir, file)
		if file != "" && dir == prefix {
			result = append(result, file)
		}
		p := strings.TrimPrefix(dir, prefix)
		_dir := strings.Split(p, "/")
		if _dir[0] != "" {
			dirMap[_dir[0]+"/"] = true
		}

		//if strings.HasSuffix(dir, "/") && strings.Count(p, "/") == 1 {
		//result = append(result, p)
		//}
	}
	for key, _ := range dirMap {
		result = append(result, key)
	}

	//data, _ := json.Marshal(resp)
	c.JSON(http.StatusOK, gin.H{"data": (result)})
}

func (handler *httpHanlder) GetConfig(c *gin.Context) {
	opts := []clientv3.OpOption{}
	opts = append(opts, clientv3.WithSerializable())

	//cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	//if err != nil {
	//c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	//return
	//}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	resp, err := cli.Get(ctx, c.Param("key"), opts...)
	if err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//data, _ := json.Marshal(resp)
	c.JSON(http.StatusOK, gin.H{"data": resp})
}
