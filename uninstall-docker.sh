#!/bin/bash

echo "Uninstalling Docker Desktop..."

# Docker Desktopアプリケーションを削除
sudo rm -rf /Applications/Docker.app

# Docker関連ファイルを削除
sudo rm -rf ~/Library/Group\ Containers/group.com.docker
sudo rm -rf ~/Library/Containers/com.docker.docker
sudo rm -rf ~/.docker

# Dockerコマンドラインツールを削除
sudo rm -f /usr/local/bin/docker
sudo rm -f /usr/local/bin/docker-compose
sudo rm -f /usr/local/bin/docker-machine
sudo rm -rf /usr/local/bin/docker-*

echo "Docker Desktop has been uninstalled."
echo "Please download and install Docker Desktop for Apple Silicon from:"
echo "https://www.docker.com/products/docker-desktop/"