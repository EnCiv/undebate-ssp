#!/bin/bash
#
# DO NOT put secrets in this file!!!
echo 'echo "Setting App env variables"' >> .bashrc
echo 'echo "Changing \$HOME from $HOME to this directory: $PWD, so git push to Heroku will use the _netrc file here"' >> .bashrc
echo 'export HOME=`pwd`' >> .bashrc
echo "alias branches=\"git for-each-ref --sort=committerdate refs/heads/ --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(color:red)%(objectname:short)%(color:reset) - %(contents:subject) - %(authorname) (%(color:green)%(committerdate:relative)%(color:reset))'\"" >> .bashrc
echo "export NODE_ENV=\"development\"" >> .bashrc
echo "export EDITOR=\"code --wait\"" >> .bashrc
echo "export HOST_NAME=\"http://localhost:3011\""
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "alias dbup=\"export MONGODB_URI=mongodb://localhost:27017/test?connectTimeoutMS=3000000 && sudo rm -rf tmp/db && mkdir -p tmp/db && sudo mongod --quiet --dbpath ./tmp/db --port 27017 &\"" >> .bashrc
else
    echo "alias dbup=\"export MONGODB_URI=mongodb://localhost:27017/test?connectTimeoutMS=3000000 && mkdir -p tmp/db && rm -rf tmp/db/* && start /b mongod --quiet --dbpath ./tmp/db --port 27017\"" >> .bashrc
fi
echo "alias dbdown=\"mongo --eval \\\"db.getSiblingDB('admin').shutdownServer(); quit()\\\"\"" >> .bashrc
