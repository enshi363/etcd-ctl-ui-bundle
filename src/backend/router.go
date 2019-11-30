package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gobuffalo/packr/v2"
)

type httpHanlder struct{}

var handler = &httpHanlder{}

func routerHandler() http.Handler {
	e := gin.New()
	e.Use(gin.Recovery())
	admin := e.Group(Env.GetBaseURI()+"admin", authMiddleware.Verify())

	box := packr.New("myBox", "./static")
	s, err := box.FindString("index.html")
	if err != nil {
		log.Fatal(err)
	}
	box.AddString("index.html", strings.Replace(s, "BASEURI=\"/api\"", "BASEURI=\""+Env.GetBaseURI()+"\"", -1))
	e.StaticFS("/webui", box)

	//e.Static(Env.GetBaseURI()+"/assets", "./assets")

	// login
	e.POST(Env.GetBaseURI()+"login", handler.login)

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
	admin.PUT("/user-role/:username/:role", handler.GrantUserRole)
	admin.DELETE("/user-role/:username/:role", handler.RevokeUserRole)
	admin.GET("/users", handler.GetUserList)
	admin.GET("/user/:username", handler.GetUser)
	admin.PATCH("/user/:username", handler.ChangePassword)

	// router for getting cluster status
	admin.GET("/cluster/status", handler.ClusterMembers)

	admin.GET("/kvs", handler.GetConfigList)
	admin.PUT("/kv", handler.PutConfig)
	admin.DELETE("/kv/*key", handler.RemoveConfig)
	admin.GET("/kv/*key", handler.GetConfig)

	return MethodOverride(e)
}
