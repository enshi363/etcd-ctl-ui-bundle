package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type httpHanlder struct{}

var handler = &httpHanlder{}

func routerHandler() http.Handler {
	e := gin.New()
	e.Use(gin.Recovery())
	admin := e.Group(Env.GetBaseURI()+"admin", authMiddleware.Verify())

	e.Static("/assets", "./assets")

	// login
	e.POST("/login", handler.login)

	// route for role
	admin.POST("/role", handler.AddRole)
	admin.DELETE("/role/:role", handler.RemoveRole)
	admin.PUT("/permission/:role", handler.GrantRolePermission)
	admin.DELETE("/permission/:role", handler.RevokeRolePermission)
	admin.GET("/roles", handler.GetRoleList)
	admin.GET("/role/:role", handler.GetRole)

	// router for user
	admin.POST("/user", handler.AddUser)
	admin.DELETE("/user/:username", handler.RemoveUser)
	admin.PUT("/user-role/:username", handler.GrantUserRole)
	admin.DELETE("/user-role/:username/:role", handler.RevokeUserRole)
	admin.GET("/users", handler.GetUserList)
	admin.GET("/user/:username", handler.GetUser)
	admin.PATCH("/user/:username", handler.ChangePassword)

	// router for getting cluster status
	admin.GET("/cluster/status", handler.ClusterMembers)

	admin.GET("/kvs", handler.GetConfigList)
	admin.PUT("/kv", handler.PutConfig)
	admin.DELETE("/kv/*", handler.RemoveConfig)
	return e
}
