package main

import (
	"fmt"
	"os"
	"strings"
)

const (
	ETCD_UI_ENDPOINTS = "ETCD_UI_ENDPOINTS"

	ETCD_UI_LISTEN_PORT = "ETCD_UI_LISTEN_PORT"

	ETCD_UI_SECRET = "ETCD_UI_SECRET"

	DEFAULT_SECRET = "mFBMR9Yk"

	DEFAULT_PORT = ":8088"

	ETCD_UI_BASEURI = "ETCD_UI_BASEURI"
)

type Environment struct {
	Endpoints  []string
	ListenPort string
	Secret     []byte
	BaseUri    string
}

var Env = &Environment{}

func (env *Environment) GetEndPoints() []string {
	if len(env.Endpoints) > 0 {
		return env.Endpoints
	}
	if endpoints := os.Getenv(ETCD_UI_ENDPOINTS); endpoints != "" {
		fmt.Printf("Recognize environment variable %s,use endpoints:%s", ETCD_UI_ENDPOINTS, endpoints)
		env.Endpoints = strings.Split(endpoints, ",")
	}
	return env.Endpoints
}

func (env *Environment) GetListenPort() string {
	if env.ListenPort != "" {
		return env.ListenPort
	}
	if port := os.Getenv(ETCD_UI_LISTEN_PORT); port != "" {
		fmt.Printf("Recognize environment variable %s,use listen port :%s", ETCD_UI_LISTEN_PORT, port)
		env.ListenPort = port
	} else {
		env.ListenPort = DEFAULT_PORT
	}
	return env.ListenPort
}

func (env *Environment) GetSecretKey() []byte {
	if len(env.Secret) > 0 {
		return env.Secret
	}

	if secret := os.Getenv(ETCD_UI_SECRET); secret != "" {
		fmt.Printf("Recognize environment variable %s,use secret :%s", ETCD_UI_SECRET, secret)
		env.Secret = []byte(secret)
	} else {
		env.Secret = []byte(DEFAULT_SECRET)
	}

	return env.Secret
}

func (env *Environment) GetBaseURI() string {
	if env.BaseUri != "" {
		return env.BaseUri
	}
	if base := os.Getenv(ETCD_UI_BASEURI); base != "" {
		fmt.Printf("Recognize environment variable %s,use base uri :%s", ETCD_UI_BASEURI, base)
		env.BaseUri = base
	} else {
		env.BaseUri = "/"
	}
	return env.BaseUri
}
