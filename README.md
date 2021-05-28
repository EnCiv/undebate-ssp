# Civil Server Template
This template setups up a featurful Node Server quickly, by extending the Civil Server [repo](https://github.com/EnCiv/civil-server)

![civil-server](https://user-images.githubusercontent.com/3317487/105109776-103ae980-5a72-11eb-8182-d0f8d3cdcc30.png)

**Copyright 2021 EnCiv, Inc.** This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/undebate/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition

# Table of Contents
1. [Getting Started](#getting-started)
2. [Building Your Website](#building-your-website)

# Getting Started

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
    source ./barshrcsetup.sh
```
### MongoDB
This app uses MONGODB and you will need a mongodb uri to get started.   Cloud.mongodb.com has free accounts, you can go there and follow these [instructions](https://docs.google.com/presentation/d/10fEk_OdfN-dYh9PlqG6nTFlu4ENvis_owdHbqWYDpBI/present?slide=id.gb4a0dbf10b_0_93)

you should end up with a .bashrc file that looks like this
```
#!/bin/bash
export NODE_ENV="development"
export MONGODB_URI="mongodb+srv://user-name:secret-password@cluster0.vwxyz.mongodb.net/db-name?retryWrites=true&w=majority"
```
Note that it's confusing but user-name and db-name can be anything.  You pick them when you create the database, and you use them in this URI string.  That's all.  
### Run it
```
source .bashrc
npm run dev
```
You will now be able to go to http://localhost:3011 and it will take you to the Join page
You can see more about that you can do with the Civil Server at https://github.com/EnCiv/civil-server
You can also edit code, and when you save it the running code will automatically be updated.

### Run it in the cloud on heroku
This assumes you have already created your heroku account at heroku.com and that you have installed the heroku command line interface (CLI) from https://devcenter.heroku.com/articles/heroku-cli



You will need to think of your own unique application name.  If you get an error from this step, it may be because the name you thought of is not unique.
```
heroku create my-unique-app-name
```
First, lets do a few things to setup the enviromment
```
echo export EDITOR="code --wait" >> .bashrc
source .bashrc
heroku config:set MONGODB_URI=""
heroku config:edit MONGODB_URI
```
The last step will open up a new Visual Studio Code window, with nothing in it.
Paste in the URI again, just the URI like:
```
mongodb+srv://any-name-you-want:Znkx8UyAZAV15xRK@cluster0.xtpzi.mongodb.net/anydbname?retryWrites=true&w=majority
```
&nbsp;&nbsp;&nbsp;&nbsp;Then do Control-s Control-w to save and exit

Back in the terminal window you will see:
```
Fetching config... done

Config Diff:
- MONGODB_URI=
+ MONGODB_URI='mongodb+srv://any-name-you-want:Znkx8UyAZAV15xRK@cluster0.xtpzi.mongodb.net/anydbname?retryWrites=true&w=majority'

Update config on my-unique-aoo-name with these values?:  
```
&nbsp;&nbsp;&nbsp;&nbsp;hit 'y' and \<Enter\>

All of this is configuration stuff you only have to do once.   You can push the code to the heroku server with
```
git push heroku
```
When that is done, you will be able to go to our new app by browsing to https://my-unique-app-name.herokuapp.com (don't click on this link - you will have to type in your own app-name yourself)

Then whenever you make changes to your code and you want to try it out on heroku you can:
```
git add .
git commit -m "a descriptive commit message"
git push heroku
```

## Load your environment variables automatically when bash starts
Create this file in your home directory. Or add this if the file already exists.
On Windows thats usually C:/Users/Your Name/.bashrc
on Mac it's /Users/Your user name/.profile
```
if [[ `pwd` != $HOME ]] && [[ -f "./.bashrc" ]]; then 
    echo running `pwd`/.bashrc
    source ./.bashrc
fi
```

# Building Your Website
The way this server works is that when someone browses to a page, the path (eg `/home`) is looked up in the database, and the corresponding doc is found. The webComponent property ("Home") is used as a key. The web comonents in app/components/web-components are turned into an index where the ReactCase version of the filename is key, and the react component is the value. All the properties in the doc, are passed to the webComponent.

```
const Components={
    'Home': require('./home'),
    'Join': require('./../../node_modules/civil-server/dist/components/web-components/join')
}
```
The home component is part of the template, that you can modify or replace as you see fit.  The join component is inherited from the civil-server repo itself.  You can, create a new join component to replace it. 

The Home page is composed of two parts, a document in the Mongo database, and a React component.  The React component in __app/web-components/home.jsx__ that looks like this:
```
'use strict';

import React from "react"

export default function Home(props){
    const {subject, description}=props
    return (
    <div style={{width: '100vw', height: '100vh'}}>
        <div style={{textAlign: 'center'}}>{subject}</div>
        <div style={{textAlign: 'center'}}>{description}</div>
        <div style={{textAlign: 'center'}}>Welcome!</div>
    </div>
    )
}
```
The subject and description props are taken from the database, and passed to the web component before it is rendered. The object in __iotas.json__ that looks like this:
```
[
    {...},
    {
        "_id": {
            "$oid": "600610cd63b01a0854ddf1b3"
        },
        "path": "/home",
        "subject": "Civil Server Template",
        "description": "Civil Server Template Home Page",
        "webComponent": "Home"
    },
    {...}
]
```
You can add new documents (that's what MongoDB calls them, in JS they're objects) to iotas.json.   Each new iota document should have a unique _id property.  To generate one, do this
```
node node_modules/civil-server/dist/tools/mongo-id.js
```
And it will give you back a string that you can use as the $oid
```
[
    {...},
    {
        "_id": {
            "$oid": "600610cd63b01a0854ddf1b3"
        },
        "path": "/home",
        "subject": "Civil Server Template",
        "description": "Civil Server Template Home Page",
        "webComponent": "Home"
    },
        {
        "_id": {
            "$oid": "600efa3bfc2b9f362410cf7d"
        },
        "path": "/about",
        "subject": "Civil Server Template -About",
        "description": "Civil Server Template About Page",
        "webComponent": "Home"
    },
    {...}
]
```
The documents in iotas.json are loaded into the mongo database at startup. In production (NODE_ENV=production) the database is only loaded if it was empty - meaning you are initializing a new database.



