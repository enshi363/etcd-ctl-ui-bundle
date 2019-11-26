package main

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.etcd.io/etcd/clientv3"
)

// Binding from JSON
type Role struct {
	Name string `form:"name" json:"name" xml:"name"  binding:"required"`
	Key  string `form:"key" json:"key" xml:"key" `
	End  string `form:"endkey" json:"endkey" xml:"endkey" `
	Type int32  `form:"t" json:"t" xml:"t"`
}

func (handler *httpHanlder) AddRole(c *gin.Context) {
	var json Role
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	if _, err = cli.RoleAdd(context.TODO(), json.Name); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) GrantRolePermission(c *gin.Context) {
	var json Role
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	if _, err = cli.RoleGrantPermission(
		context.TODO(),
		json.Name, // role name
		json.Key,  // key
		json.End,  // range end
		clientv3.PermissionType(json.Type),
	); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) RevokeRolePermission(c *gin.Context) {
	var json Role
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	if _, err = cli.RoleRevokePermission(
		context.TODO(),
		json.Name, // role name
		json.Key,  // key
		json.End,  // range end
	); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) RemoveRole(c *gin.Context) {
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	if _, err = cli.RoleDelete(
		context.TODO(),
		c.Param("role"), // role name
	); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": ":)"})
}

func (handler *httpHanlder) GetRoleList(c *gin.Context) {
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	resp, err := cli.RoleList(
		context.TODO(),
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//rolesJson, _ := json.Marshal(resp.Roles)
	c.JSON(http.StatusOK, gin.H{"roles": (resp.Roles)})
}

func (handler *httpHanlder) GetRole(c *gin.Context) {
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	resp, err := cli.RoleGet(
		context.TODO(),
		c.Param("role"),
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"permissions": resp})
}
