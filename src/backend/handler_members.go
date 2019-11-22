package main

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (handler *httpHanlder) ClusterMembers(c *gin.Context) {
	cli, err := NewEtcdClient(c.MustGet("user.name").(string), c.MustGet("user.password").(string))
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	defer cli.Close()
	resp, err := cli.MemberList(context.Background())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	memberjson, _ := json.Marshal(resp.Members)
	c.JSON(http.StatusOK, gin.H{"members": string(memberjson)})
}
