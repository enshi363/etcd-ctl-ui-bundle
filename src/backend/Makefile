all:
	packr2 clean
	packr2 
	rm -rf ../../prebuild/*
	GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o ../../prebuild/etcd-webui-macos-amd64 . 
	GOOS=linux GOARCH=amd64 go build -ldflags="-s -w"  -o ../../prebuild/etcd-webui-linux-amd64 .
