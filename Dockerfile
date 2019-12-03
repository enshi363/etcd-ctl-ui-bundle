FROM alpine as composer

RUN mv /etc/apk/repositories /etc/apk/repositories.old && sed -e 's/dl-cdn.alpinelinux.org/mirrors.sjtug.sjtu.edu.cn/g' /etc/apk/repositories.old > /etc/apk/repositories && \
    echo 'http://mirrors.sjtug.sjtu.edu.cn/alpine/edge/testing' >> /etc/apk/repositories && \ 
    apk update && apk --no-cache add etcd-ctl && \
    wget https://github.com/enshi363/etcd-ctl-ui-bundle/releases/download/v1.0.1/etcd-webui-linux-amd64 && \
    chmod +x ./etcd-webui-linux-amd64

EXPOSE 8088

CMD ['./etcd-webui-linux-amd64']
