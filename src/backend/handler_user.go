package main

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"go.etcd.io/etcd/clientv3"
)

func (handler *httpHanlder) AddUser(c *gin.Context) {
	var json User
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	if json.User == "root" {
		c.JSON(http.StatusForbidden, gin.H{"error": "cannot add root ,please set manully on your etcd server"})
		return

	}
	if _, err := cli.UserAdd(context.TODO(), json.User, json.Password); err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) GrantUserRole(c *gin.Context) {
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	if _, err := cli.UserGrantRole(
		context.TODO(),
		c.Param("username"),
		c.Param("role"),
	); err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//if c.Param("username") == "root" && c.Param("role") == "root" {
	//cli.AuthEnable(context.TODO())
	//}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) RevokeUserRole(c *gin.Context) {
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	if _, err := cli.UserRevokeRole(
		context.TODO(),
		c.Param("username"),
		c.Param("role"),
	); err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) RemoveUser(c *gin.Context) {
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	//if c.Param("username") == "root" {
	//root then try disable auth
	//if _, err := cli.AuthDisable(context.TODO()); err != nil {
	//c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	//return
	//}
	//}
	if _, err := cli.UserDelete(
		context.TODO(),
		c.Param("username"),
	); err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) GetUserList(c *gin.Context) {
	//cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	//if err != nil {
	//c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	//return
	//}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	resp, err := cli.UserList(
		context.TODO(),
	)
	if err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//userJson, _ := json.Marshal(resp.Users)
	c.JSON(http.StatusOK, gin.H{"users": (resp.Users)})
}

func (handler *httpHanlder) GetUser(c *gin.Context) {
	//cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	//if err != nil {
	//c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	//return
	//}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	resp, err := cli.UserGet(
		context.TODO(),
		c.Param("username"),
	)
	if err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//roleJson, _ := json.Marshal(resp.Roles)
	c.JSON(http.StatusOK, gin.H{"roles": resp.Roles})
}

func (handler *httpHanlder) ChangePassword(c *gin.Context) {
	var json User
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	//if err != nil {
	//c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
	//return
	//}
	cli := c.MustGet("etcdClient").(*clientv3.Client)
	defer cli.Close()
	if _, err := cli.UserChangePassword(
		context.TODO(),
		json.User,
		json.Password,
	); err != nil {
		if strings.Contains(err.Error(), "permission denied") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}
