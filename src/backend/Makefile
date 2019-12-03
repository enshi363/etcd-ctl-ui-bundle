all:
	#packr2 clean
	#packr2 
	rm -rf ../../prebuild/*
	GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o ../../prebuild/etcd-webui-macos-amd64 . 
	GOOS=linux GOARCH=amd64 go build -ldflags="-s -w"  -o ../../prebuild/etcd-webui-linux-amd64 .
	#docker run --rm -v "/Users/shien/Workspace/web-projects/etcd-ctl-ui-bundle/src/backend":/usr/src/myapp -w /usr/src/myapp -e GOOS=darwin -e GOARCH=amd64 -e GO111MODULE=on -e GOPROXY=https://goproxy.cn golang:1.13 go get -u github.com/gobuffalo/packr/v2/packr2 && packr2 clean&&packr2 && go build -v -a
