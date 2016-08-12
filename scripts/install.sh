#!/bin/bash
#install required packages
curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install build-essential

#add current user to sudoer
PERM=0440
current_user=$(whoami)
command="echo \"$current_user ALL=(ALL) NOPASSWD: ALL\" > /etc/sudoers.d/$current_user"
sudo sh -c "$command"
command="chmod $PERM /etc/sudoers.d/$current_user"
sudo sh -c "$command"

#setting node env
command "export NODE_ENV=production > ~/.bashrc"

#copy users.json
mkdir data
cp ./template/users.json data

#install node packages
sudo npm install -g gulp-cli
sudo npm install -g pm2
npm install

#gulp 
gulp build-server
gulp build-client

#logrotate
sudo pm2 logrotate

#upstart scripts
sudo pm2 startup
