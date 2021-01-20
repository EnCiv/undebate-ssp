# Civil Server Template
This template setups up a featurful Node Server quickly, by extending the Civil Server [repo](https://github.com/EnCiv/civil-server)

![civil-server](https://user-images.githubusercontent.com/3317487/105109776-103ae980-5a72-11eb-8182-d0f8d3cdcc30.png)

**Copyright 2021 EnCiv, Inc.** This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/undebate/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition

# Basics

You will need to install the following, if you do not already have them.

1. Git: On windows go to https://git-scm.com/download/win and install it. If you are on a Mac, install brew first, https://brew.sh/ and then `brew install git`
2. Node.js: https://nodejs.org/en/download/
3. Heroku: https://devcenter.heroku.com/articles/heroku-cli
4. I use visual studio code, but you can use another environment, but you will need to be able to run git-bash terminal windows in your environment.
   https://code.visualstudio.com/

## Setup

On your browser go to your github account and login

If you have just installed VSC you need to setup the bash shell. Use Control-Shift-P
In the input field type "Select Default Shell"
Choose "Git Bash"

Then open a git-bash shell - on VSC use Control-\`
```
    mkdir my-app
    git clone https://github.com/EnCiv/civil-server-template my-app
    cd my-app
    npm install
```
### MongoDB
This app uses MONGODB and you will need a mongodb uri to get started.   Cloud.mongodb.com has free accounts, you can go there and follow these [instructions](https://docs.google.com/presentation/d/10fEk_OdfN-dYh9PlqG6nTFlu4ENvis_owdHbqWYDpBI/present?slide=id.gb4a0dbf10b_0_93)

you should end up with a .bashrc file that looks like this
```
#!/bin/bash
export NODE_ENV="development"
export MONGODB_URI="mongodb+srv://user-name:secret-password@cluster0.vwxyz.mongodb.net/db-name?retryWrites=true&w=majority"
```
Note that it's confsing but user-name and db-name can be anything.  You pick them when you create the database, and you use them in this URI string.  That's all.  
#### Run it
```
source .bashrc
node dist/start.js
```
You will now be able to go to http://localhost:3012 and it will take you to the Join page
You can see more about that you can do with the Civil Server at https://github.com/EnCiv/civil-server
