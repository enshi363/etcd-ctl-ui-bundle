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

	e.POST("/login", handler.login)

	admin.POST("/role", handler.AddRole)
	admin.DELETE("/role/:role", handler.RemoveRole)
	admin.PUT("/permission/:role", handler.GrantRolePermission)
	admin.DELETE("/permission/:role", handler.RevokeRolePermission)
	admin.GET("/roles", handler.GetRoleList)
	admin.GET("/role/:role", handler.GetRole)

	return e
}
