# Undebate Self Service Portal

In 2019 we created [Undebates](https://github.com/EnCiv/undebate) and launched them in the 2020 primary and general elections. In 2020 we were contacted by the UCLA Student Association who wanted this for their student body elections. We realized there are other organizations that need a way to create undebates for their democratically run elections and so this project creates a portal that allows people to create their own - for example a University Student Body might want to have undebates by the candidates for student body office like president and vice president and such. In the Undebate repo we documented the requirements for a portal for election leaders in this [issue](https://github.com/EnCiv/undebate/issues/301).

## [Example:](https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07)

[![image](https://user-images.githubusercontent.com/3317487/133139497-b040d82c-cb7c-46b0-8a2b-e6a44b2ffcd3.png)](https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07)

## [Why](https://www.behance.net/gallery/127641633/Self-Service-Portal)

[![image](https://user-images.githubusercontent.com/3317487/139926780-3aa5346c-6108-488e-9d52-54fc6b3e32d0.png)](https://www.behance.net/gallery/127641633/Self-Service-Portal)

**Copyright 2021 EnCiv, Inc.** This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/undebate/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition

# Getting Started

## **Slack** - Use this form to get an invite to the [slack workspace](https://docs.google.com/forms/d/e/1FAIpQLSee58BUiy12dtloG9pLITsELcNldIwXcEtCotV9r95BZJSIVA/viewform)

## [Node](https://nodejs.org/en/download/)

[Download](https://nodejs.org/en/download/) the **LTS version** not the Current Version. This project uses some packages, like bcrypt, that install binary code into node for efficiency. It takes these packages time to catch up.

The following has been tested using node v16.13.0 and npm v8.1.0 on Windows 10 and MacOs. There are known issues using npm < 7. During install, you can ignore the warning about incompatibility with previous versions of node/npm - we need to go back to those packages and update their dependencies. Also, Node version 17 will not work, and in general the odd versions are experimental so we don't try to use those. If you already tried to build this with version 17, you need to install version 16 and then do `npm ci` to start clean.

## GIT

On PC, install [Git for Windows](https://git-scm.com/download/win)
On Mac,install [Brew](https://brew.sh/) first, and then `brew install git`
There are gui and web based systems for doing git and you are welcome to use them, but it is easier to document what to do using a CLI.

## Install

Below are specific instructions for cloning and running storybook on your local system using your CLI of choice:

```
# Navigate to the local directory where you'd like to clone the project and then issue the following command:
git clone https://github.com/EnCiv/undebate-ssp.git

# Now navigate into the newly cloned project directory:
cd undebate-ssp

# Install the node_module dependencies required to run this project:
npm install

# Now start the project:
npm run storybook
```

A storybook browser window will open up:

![image](https://user-images.githubusercontent.com/3317487/147786004-a6cf5bb9-030a-4011-b0e3-eabc4a1f4c38.png)

Storybook allows us to create React components independently, test them, and leaves a visual catalog of our components for the next contributer. Also, as soon as you get your new component and story started, you can build/edit them on the fly and the browser will update as you make your changes. (Because Storybook uses Webpack to push updates to the browser).

## .bashrc

This project uses bash on windows or zsh on mac. This models the cloud environment. The .bashrc file in the each project's directory can contain custom environment variables and aliases and such for the project. This is where we put secrets becasue the .bashrc file is ignored by git and won't be put in the repo.

Make sure that in hour home (cd ~) directory you have a **.bash_profile** on PC or a **.profile** on mac file that contains something like:

```
test -f ~/.bashrc && . ~/.bashrc
```

or

```
if [`pwd` != $HOME ] && [[ -f "./.bashrc" ]]; then
    echo running `pwd`/.bashrc
    source ./.bashrc
fi
```

cd back to the directory with your this repo and from the command line do

```
source ./bashrcsetup.sh
```

This will initialize the .bashrc file for this project with a few simple things. But don't do this more than once (as it would create redundant entries in the file).
Then everytime you work on this project, the environment variable will be set for this project. If you setup a .bashrc file for another repo, when you work on that repo it will use those environment variables.

## MongoDB

To develope on the server side (not required for storybook above), MongoDB is required. It's possible to do this with a (free) hosted database or with a localy running one. The advantage of hosted is that if you move between local development and cloud deployment like on heroku, the hosted database allows you to access the same data from both places.

### To setup MongoDB hosted (recommended)

Go to these [slides](https://docs.google.com/presentation/d/1HzXSX_fo0qr8ozC9rLGaWc965vM9IGEpCuIx8jmcUxI/present) to setup a free MongoDB Atlas account and database, and create a MONGODB_URI in your .bashrc file

### To setup MongoDB locally

-   on PC Get the [MongoDb Community Server](https://www.mongodb.com/try/download/community) for your system.
-   on Mac do `brew tap mongodb/brew` and then `brew install mongodb-community@5.0`

After it has been installed, use `dbup` to bring up the datbase. It will store the data in a **tmp** directory in your project that is .gitignore'd so it won't get pushed to the repo.
`dbdown` will shut down the database

**Note:** that these scripts for running the database locally will erase the database every time. If there are database recordes that should be made a permanent part of the project, put them in iotas.json.

## Cloudinary

Videos and images are stored at cloudinary, a content delivery network (CDN) with image and video transform APIs. You won't need this until you start posting recorded videos, so you can set it up now, or later by following these [instructions](https://docs.google.com/presentation/d/14i6XuQ1i5HuM1BS69s4m6FHI0FK9ketSdERvid7LJTo/present)

## Running the Dev server

After the database is up, you can do `npm run dev` and this will start the server. There will be warnings about other enviornment variable that aren't setup, but we don't need those.

```
$ npm run dev
```

<details>
    <summary>Output</summary>
    
```
> undebate-ssp@v0.0.0 dev
> bash postinstall.sh && echo "these delays need to be kept up to date" && concurrently -k "npm run hot-transpile" "sleep 20 && npm run hot-server" "sleep 15 && npm run hot-client"

---

POSTINSTALL

---

---

Svgr

---

> undebate-ssp@v0.0.0 svgr
> svgr --icon --filename-case kebab assets/svg --out-dir app/svgr && rm app/svgr/index.js

assets\svg\chevron_left.svg -> app\svgr\chevron-left.js
assets\svg\accepted.svg -> app\svgr\accepted.js
assets\svg\check-mark.svg -> app\svgr\check-mark.js
assets\svg\book_open.svg -> app\svgr\book-open.js
assets\svg\chevron_down.svg -> app\svgr\chevron-down.js
assets\svg\clock-solid.svg -> app\svgr\clock-solid.js
assets\svg\calendar.svg -> app\svgr\calendar.js
assets\svg\completed.svg -> app\svgr\completed.js
assets\svg\clock.svg -> app\svgr\clock.js
assets\svg\lock.svg -> app\svgr\lock.js
assets\svg\deadline_missed.svg -> app\svgr\deadline-missed.js
assets\svg\home.svg -> app\svgr\home.js
assets\svg\reminder_sent.svg -> app\svgr\reminder-sent.js
assets\svg\magnifying-glass.svg -> app\svgr\magnifying-glass.js
assets\svg\declined.svg -> app\svgr\declined.js
assets\svg\default-user.svg -> app\svgr\default-user.js
assets\svg\right-arrow.svg -> app\svgr\right-arrow.js
assets\svg\log-out.svg -> app\svgr\log-out.js
assets\svg\undebate-logo.svg -> app\svgr\undebate-logo.js
assets\svg\speaker.svg -> app\svgr\speaker.js
assets\svg\sent.svg -> app\svgr\sent.js
assets\svg\video_submitted.svg -> app\svgr\video-submitted.js
assets\svg\video.svg -> app\svgr\video.js
No parser and no filepath given, using 'babel' the parser now but this will throw an error in the future. Please specify a parser or a filepath so one can be inferred.
dirPath [
'app/web-components/',
'node_modules/civil-server/dist/web-components/',
'node_modules/undebate/dist/web-components/'
]
filePath app/web-components/
filePath node_modules/civil-server/dist/web-components/
filePath node_modules/undebate/dist/web-components/
dirPath [
'app/data-components/',
'node_modules/civil-server/dist/data-components/',
'node_modules/undebate/dist/data-components/'
]
filePath app/data-components/
filePath node_modules/civil-server/dist/data-components/
filePath node_modules/undebate/dist/data-components/

> undebate-ssp@v0.0.0 transpile
> babel app --ignore \*\*/**tests** --out-dir dist --source-maps

Successfully compiled 72 files with Babel (3755ms).
transpile ok
"these delays need to be kept up to date"
[0]
[0] > undebate-ssp@v0.0.0 hot-transpile
[0] > babel --watch app --ignore \*_/**tests** --out-dir dist --source-maps
[0]
[0] Successfully compiled 72 files with Babel (1759ms).
[2]
[2] > undebate-ssp@v0.0.0 hot-client
[2] > webpack-dev-server --config webpack-dev.config.js --devtool source-map --host 0.0.0.0
[2]
[1]
[1] > undebate-ssp@v0.0.0 hot-server
[1] > nodemon --inspect dist/start.js
[1]
[1] [nodemon] 2.0.15
[1] [nodemon] to restart at any time, enter `rs`
[1] [nodemon] watching path(s): _._
[1] [nodemon] watching extensions: js,mjs,json
[1] [nodemon] starting `node --inspect dist/start.js`
[1] Debugger listening on ws://127.0.0.1:9229/938be1cb-8caa-4c69-adf2-0cd72312ed7c
[1] For help, see: https://nodejs.org/en/docs/inspector
[2] <w> [webpack-dev-server] "hot: true" automatically applies HMR plugin, you don't have to add it manually to your webpack configuration.
[2] <i> [webpack-dev-server] [HPM] Proxy created: / -> http://localhost:3012
[2] <i> [webpack-dev-server] Project is running at:
[2] <i> [webpack-dev-server] Loopback: http://localhost:3011/
[2] <i> [webpack-dev-server] On Your Network (IPv4): http://192.168.1.22:3011/
[2] <i> [webpack-dev-server] Content not from webpack is served from 'C:\Users\David Fridley\git\EnCiv\undebate-ssp\public' directory
[2] asset main.js 5.64 MiB [emitted] (name: main) 1 related asset
[2] asset only-dev-server.js 225 KiB [emitted] (name: only-dev-server) 1 related asset
[2] orphan modules 31.6 KiB [orphan] 42 modules
[2] runtime modules 54.4 KiB 28 modules
[2] modules by path ../node_modules/ 4.9 MiB
[2] javascript modules 4.83 MiB 985 modules
[2] json modules 67 KiB
[2] modules by path ../node_modules/react-html-parser/ 62.9 KiB 9 modules
[2] ../node_modules/undebate/public.json 447 bytes [built] [code generated]
[2] ../node_modules/constants-browserify/constants.json 3.71 KiB [built] [code generated]
[2] modules by path ./ 6.17 KiB
[2] modules by path ./components/_.js 2.36 KiB 2 modules
[2] modules by path ./web-components/\*.js 3.5 KiB 2 modules
[2] ./client/main-app.js 308 bytes [built] [code generated]
[2] ./util.inspect (ignored) 15 bytes [built] [code generated]
[2] 11 modules
[2]
[2] WARNING in ../node_modules/log4js/lib/appenders/index.js 38:11-30
[2] Critical dependency: the request of a dependency is an expression
[2] @ ../node_modules/log4js/lib/log4js.js 27:18-40
[2] @ ../node_modules/civil-client/dist/client/main.js 58:17-34
[2] @ ../node_modules/civil-client/dist/index.js 35:35-59
[2] @ ./client/main-app.js 1:0-42 5:0-10
[2]
[2] WARNING in ../node_modules/log4js/lib/clustering.js 4:10-28
[2] Module not found: Error: Can't resolve 'cluster' in 'C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\log4js\lib'
[2] @ ../node_modules/log4js/lib/log4js.js 30:19-42
[2] @ ../node_modules/civil-client/dist/client/main.js 58:17-34
[2] @ ../node_modules/civil-client/dist/index.js 35:35-59
[2] @ ./client/main-app.js 1:0-42 5:0-10
[2]
[2] 2 warnings have detailed information that is not shown.
[2] Use 'stats.errorDetails: true' resp. '--stats-error-details' to show it.
[2]
[2] webpack 5.65.0 compiled with 2 warnings in 6621 ms
[1] Log.init creating collection
[1] [2022-02-27T15:24:09.828] [INFO] node - Iota.init count 0
[1] [2022-02-27T15:24:09.833] [ERROR] node - Iota.\_write_load duplicate id found. Replacing:
[1] {
[1] \_id: 621c0819ec1ee607188ac377,
[1] path: '/test-election-docs',
[1] parentId: '600f2e3d7be64409f0387718',
[1] subject: 'Testing get-election-docs socket API',
[1] description: 'Testing get-election-docs socket API',
[1] webComponent: 'TestElectionDocs'
[1] }
[1] with
[1] {
[1] \_id: '61edf8791dff058c2a73724d',
[1] userId: '61edf83e01fb518ba162fe70',
[1] subject: 'Election document',
[1] description: 'Election document #1',
[1] webComponent: 'ElectionDoc'
[1] }
[1] [2022-02-27T15:24:09.834] [ERROR] node - Iota.\_write_load duplicate id found. Replacing:
[1] {
[1] \_id: 621c0819ec1ee607188ac379,
[1] userId: '61edf83e01fb518ba162fe70',
[1] subject: 'Election document',
[1] description: 'Election document #1',
[1] webComponent: 'ElectionDoc'
[1] }
[1] with
[1] {
[1] \_id: '61edf96846c0a28ef1ce5d5d',
[1] userId: '61edf83e01fb518ba162fe70',
[1] subject: 'Election document',
[1] description: 'Election document #2',
[1] webComponent: 'ElectionDoc'
[1] }
[1] [2022-02-27T15:24:09.834] [ERROR] node - Iota.\_write_load duplicate id found. Replacing:
[1] {
[1] \_id: 621c0819ec1ee607188ac37b,
[1] userId: '61edf83e01fb518ba162fe70',
[1] subject: 'Election document',
[1] description: 'Election document #2',
[1] webComponent: 'ElectionDoc'
[1] }
[1] with
[1] {
[1] \_id: '61edf96be782378f2179622e',
[1] userId: '61edf83e01fb518ba162fe70',
[1] subject: 'Election document',
[1] description: 'Election document #3',
[1] webComponent: 'ElectionDoc'
[1] }
[1] [2022-02-27T15:24:09.835] [ERROR] node - Iota.\_write_load duplicate id found. Replacing:
[1] {
[1] \_id: 621c0819ec1ee607188ac37d,
[1] userId: '61edf83e01fb518ba162fe70',
[1] subject: 'Election document',
[1] description: 'Election document #3',
[1] webComponent: 'ElectionDoc'
[1] }
[1] with
[1] {
[1] \_id: '61edf96c1d87738f395d12d8',
[1] userId: '61edf83e01fb518ba162fe70',
[1] subject: 'Election document',
[1] description: 'Election document #4',
[1] webComponent: 'ElectionDoc'
[1] }
[1] [2022-02-27T15:24:09.836] [INFO] node - Iota.init updating for development
[1] dirPath [
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\node_modules\\civil-server\\dist\\routes',
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\node_modules\\undebate\\dist\\routes',
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\dist\\routes'
[1] ]
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\civil-server\dist\routes/
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\undebate\dist\routes/
[1] [2022-02-27T15:24:18.698] [WARN] node - fetchHandlers: handler get-iota is being replaced from directory C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\undebate\dist\routes
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\dist\routes/
[1] dirPath [
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\node_modules\\civil-server\\dist\\socket-apis',
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\node_modules\\undebate\\dist\\socket-apis',
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\dist\\socket-apis'
[1] ]
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\civil-server\dist\socket-apis/
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\undebate\dist\socket-apis/
[1] [2022-02-27T15:24:19.043] [ERROR] node - send-email NODEMAILER_SERVICE not supported undefined
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\dist\socket-apis/
[1] [2022-02-27T15:24:20.867] [INFO] node - Server is listening { port: 3012, env: 'development' }
[1] [2022-02-27T15:24:20.869] [INFO] node - socketIO listening
[1] SocketAPI started
[1] dirPath [
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\node_modules\\civil-server\\dist\\events',
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\node_modules\\undebate\\dist\\events',
[1] 'C:\\Users\\David Fridley\\git\\EnCiv\\undebate-ssp\\dist\\events'
[1] ]
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\civil-server\dist\events/
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\node_modules\undebate\dist\events/
[1] [2022-02-27T15:24:23.055] [ERROR] node - env SENDINBLUE_API_KEY not set. Notification of New Participants not enabled
[1] [2022-02-27T15:24:23.056] [ERROR] node - env SENDINBLUE_TEMPLATE_ID not set. Notification of New Participants not enabled
[1] [2022-02-27T15:24:23.056] [ERROR] node - env NOTIFY_OF_NEW_PARTICIPANT_TO not set. Notification of New Participants not enabled
[1] [2022-02-27T15:24:25.842] [ERROR] node - env TRANSCRIPTION_CLIENT_EMAIL not set. Transcription not enabled
[1] [2022-02-27T15:24:25.842] [ERROR] node - env TRANSCRIPTION_PRIVATE_KEY not set. Transcription not enabled
[1] [2022-02-27T15:24:25.843] [ERROR] node - env TRANSCRIPTION_PROJECT_ID not set. Transcription not enabled
[1] filePath C:\Users\David Fridley\git\EnCiv\undebate-ssp\dist\events/
[1] [2022-02-27T15:24:25.850] [INFO] node - started

````
The output may differ from this example.

</details>


With the server runing you can browse to `localhost:3011/qa/ccwrapper` and see a candidate conversation. And you can visit `localhost:3011/qa/ccwrapper-recorder' and be a participant.

# Find **[Tasks to work on](https://github.com/EnCiv/undebate-ssp/issues)** for tasks that need doing

-   We are creating React components based on UI design in [figma](https://www.figma.com/proto/IQKPx02pkBErpmhQoECoq9/Undebate?node-id=123%3A1694&scaling=min-zoom&page-id=102%3A2&starting-point-node-id=123%3A1694)

-   For React work, look for issues with a **React** tag.

-   There are also some node and non-rendering client side tasks marked with the **Javascript** tag.

-   Each React component goes into app/components

-   For each component we will also build a story in stories/

-   Here are examples of [components](https://github.com/EnCiv/undebate-ssp/tree/main/app/components) and [stories](https://github.com/EnCiv/undebate-ssp/tree/main/stories)

-   See here for info on the [data schema](https://github.com/EnCiv/undebate-ssp/issues/46)

# React Component guidelines and notes:
<details>
    <summary>General notes on react component boilerplate stuff. Also, we want to state the 'why' for each guideline.</summary>

These notes are pretty general and always open to reevaluation.

**my-component.js**
```js
// https://github.com/EnCiv/undebate-ssp/issue/NUMBER
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function MyComponent(props) {
    const { className, style } = props
    const classes = useStylesFromThemeFunction(props)

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            Hello World
        </div>
    )
}

// we want to see the code first, so we put the classes at the bottom
const useStylesFromThemeFunction = createUseStyles(theme => ({
    wrapper: {
        background: theme.colorPrimary,
        padding: '1rem',
    },
}))
````

1. This project is using React-jss for styles, and they should be at the bottom of the file. -- It's efficient to have all the code and style for a component in one place. We've learned over time that we want to see the code first, and then look for the css, so we put the styles at the bottom. We have also started using a theme.

2. The theme is in [**app/theme.js**](https://github.com/EnCiv/undebate-ssp/blob/main/app/theme.js). We should look through there, and add to it as we go, and talk through the best ways to make properties that are common to many components. To see examples of how to use the theme and what colors, sizes and other styling information are currently part of the theme, we can also check out the 'Theme Examples' Storybook stories and its code at [**stories/theme.stories.js**](https://github.com/EnCiv/undebate-ssp/blob/main/stories/theme.stories.js).

3. As in the above example, generally components should accept className and style as parameters, and add those to the outer most element of the component they render. We use `classnames` to combine classes.

4. To make components responsive, do not use 'px'. It's really frustrating that figma shows everthing in px, but we need to convert this to 'rem', 'em', 'vw', or 'vh' as appropriate to make the components responsive. In most of the figma I've seen, a rem is 16px. The only exception to the no 'px' rule is for borders - it's fine to make a border '1px'. But it it gets bigger than that - use rem.

5. Most components should take their width from the parent - not set the width. They should figure out their padding or margin as necessary (in 'rem' usually). Consider that these components are going to run on large screens where the font size is 16 or more and small screens where the font size is 8 or less. There are exceptions.

6. File names should be all lowercase, use '-' between words, and end in .js (.jsx isn't needed). Some OS's are case sensitive others are not.

7. Within the stories.js file for a component, create multiple stories that exercise the functionality of the component. - Future contributors are going to come back to the story to see how the component works - or to test it for some new situation.

8. Include a link to the github issue as a comment at the top of the component file and the top of the story to make it easier to go back and reference it. Also, we should add comments to the issues as we make design decisions that change the original direction in the issue. - We end up putting a lot of good info, and pictures, into the issue and its useful to have it handy even after the issue is closed.

9. Components that accept input, or action from the user should accept an `onDone` parameter, which is a function to call with `{valid: bool, value: any}`. Whenever the user leaves the component, typically through onBlur the component should call onDone, and with value set to the value of this input (which could be an object), and valid set to whether or not the value is valid. Empty should - generally - be considered not valid. Higher level components will figure out how the UI reacts to the valid/value returned. This allows more complete logic than just 'required'.
 </details>

# Using Git

<details>
    <summary>We're using git from the command line, because it's easier to document what to do.</summary>
    
When starting to work on a new issue:

```
# Change your local repository's branch to its 'main' branch:
git checkout main

# Pull the current version of project from the gitHub repository and merge it into your local 'main' branch:
git pull

# Create a new local branch (e.g., issue-name#nn) where you will add your changes/fixes and switch to that branch:
git checkout -b issue-name#nn
```

Where `issue-name#nn` is like `election-date-input#7` for issue [#7](https://github.com/EnCiv/undebate-ssp/issues/7)

You don't have to include all the words if it's too long. For example `election-date#7` would be fine too. This makes it easy to find the issue and close it when reviewing the pull request.

After the new component is working great on your local system, you can push it to the github repo under that branch name:

```
git push -u origin issue-name#nn
```

After you've done this once, you can just use:

```
git push
```

to update what's on github.

When the code is ready to merge, go to github.com/EnCiv/undebate-ssp and create a pull request for it. When you go there - there will probably a note at the top asking if you want to create a pull request.

</details>

# Testing with Jest

<details>
    <summary>In many cases, like APIs, it is faster to build the API and create a test for it, than it is to test the API by going through the UI.</summary>

This project is using Jest for testing, and we have set it up to allow tests to use the Mongo database. See are example at [app/socket_apis/\_\_tests\_\_/get-election-documents](https://github.com/EnCiv/undebate-ssp/blob/main/app/socket-apis/__tests__/get-election-docs.js)

You can use `npm run test` to run all the tests or `npm run test -i ` to run just the file you are working on. For example:

```
$ npm run test -i app/socket-apis/__tests__/get-election-docs.js

> undebate-ssp@v0.0.0 test
> jest "app/socket-apis/__tests__/get-election-docs.js"

 PASS  app/socket-apis/__tests__/get-election-docs.js
  √ get election docs should return undefined if user not logged in (2 ms)
  √ get election docs should return empty array if user has no docs (4 ms)
  √ get election docs should get them (3 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        3.309 s, estimated 4 s
Ran all test suites matching /app\\socket-apis\\__tests__\\get-election-docs.js/i.
```

When you got down to writing the tests, expect is what's used to check for success or failure. Here are are the [docs on expect](https://jestjs.io/docs/expect)

## Debugging Jest

If you are trying to get a test working and need to use a debugger, here's how

```
node --inspect-brk node_modules/jest/bin/jest.js --runInBand path/to/test-file.js --config "{testTimeout: 5000000, setupFilesAfterEnv: ['<rootDir>/setupTests.js', '<rootDir>/node_modules/jest-enzyme/lib/index.js'],preset: '@shelf/jest-mongodb'}"
```

This will start Jest, but it will wait for a debugger to connect.
User the Chrome browser to browse to **about:inspect**
Wait a few seconds and you will see:
![image](https://user-images.githubusercontent.com/3317487/151715405-eb4fabd9-8cb0-4b24-b282-ab85504ea2d2.png)
Click on **inspect** at the bottom and a Chrome Debugger will open up.

If you haven't already, in Chrome you should do [Filesystem][add folder to workspace] and add the project directory. You only have to do this once.

Note that in the --config of the shell command above, testTimeout is set really large, this is so that tests don't time out while you are trying to debug them. The rest of the config is a copy of what's in jest.config.js

You won't be able to set breakpoint in the jest tests, so you'll need to add a debugger statement to get it to stop. Then you can single step and things, but breakpoints still may not work. Remember to take your debugger statements out before checking in. Example:

```
test('get election docs should return undefined if user not logged in', done => {
    function callback(docs) {
        try {
            debugger
            expect(docs).toEqual(undefined)
            done()
        } catch (error) {
            done(error)
        }
    }
    debugger
    getElectionDocs.call({}, callback)
})
```

</details>

# Icons, Figma and SVG

<details>
    <summary>You can export svg from figma and paste it into a .svg file in assets/svg to create icons.</summary>

For example assets/svg/trash-can.svg

```
<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 6.58661H5H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 6.58661V4.58661C8 4.05618 8.21071 3.54747 8.58579 3.1724C8.96086 2.79732 9.46957 2.58661 10 2.58661H14C14.5304 2.58661 15.0391 2.79732 15.4142 3.1724C15.7893 3.54747 16 4.05618 16 4.58661V6.58661M19 6.58661V20.5866C19 21.117 18.7893 21.6257 18.4142 22.0008C18.0391 22.3759 17.5304 22.5866 17 22.5866H7C6.46957 22.5866 5.96086 22.3759 5.58579 22.0008C5.21071 21.6257 5 21.117 5 20.5866V6.58661H19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 11.5866V17.5866" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 11.5866V17.5866" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

This project will automatically convert the files in assets/svg into react.js files in app/svgr on install. After you add a new file you can manually trigger the conversion with:

```
npm run svgr
```

Then you can use these svg files as React components in your code like this:

```
import SvgTrashCan from '../svgr/trash-can'

function renderSomething(){
    return <SvgTrashCan />
}
```

</details>

# Prettier

## If you don't already have [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for VSC installed, go [here](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and click **Install**.

<details>
    <summary>Prettier makes some spacing and the use of quotes and a few other things consistent across the project.</summary>

It's really handy when using Visual Studio Code (see below) to be able to just save the file and have the indenting and formatting automatically fixed up. This can help find problems sometimes, and save some of the tedium.

This repo has a .vscode/settings.json file with the basic configuation for using prettier setup for this workspace. It will not override the configuration for other workspaces.
If you are not using VSC, prettier will also be run on the changed files before you commit, but see if prettier is available for your editor and post instuctions here.

</details>

<details>
<summary>Emacs Usage</summary>

Installing the package "prettier" should cause it to just work in emacs.

Example configuration of prettier using use-package (assumes you have already installed the package). You may also want to turn it off for certain modes or projects.

```
(use-package prettier
  :init
  (add-hook 'after-init-hook 'global-prettier-mode))
```

</details>

# ESLint

## If you don't already have [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VSC installed, go [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and click **Install**.

<details>
<summary>This project is using ESLint to help prevent bugs. This works really well within the Visual Studio Code environment where it higlights the issues, and can auto fix some of them.
</summary>

There is no requirement to resolve lint issues, and many that are more preference than bug related have been turned off. If there are rules that we should turn off, or add - its worth discussing. The goal is not to enforce a particular coding style to make it "easier to read", many people work on this project who are experienced with different coding styles. The goal is to prevent bugs. The best coding style is the working code style.

One burden is that if we create new input components, we need to push them to the array in .eslintrc.js/module.exports.rules[jsx-a11y/label-has-associated-control][1].controlComponents

</details>

<details>
<summary>Emacs Usage</summary>

Emacs uses flycheck to run eslint. You must first have eslint installed locally, which can be done with `npm install --global eslint`.
After installing eslint locally, you can test it by running `npm run lint`, and you should see several files with errors and a few warnings.
If you get an error regarding `except-parens`, you might have to comment out this line (don't commit this)
`'no-cond-assign': 'except-parens'`

Example configuration of flycheck using use-package (assumes you have already installed the package).

```
(use-package flycheck
  :init (global-flycheck-mode)
  :config
  ;; use eslint with web-mode for jsx files
  (flycheck-add-mode 'javascript-eslint 'web-mode))
```

Note that this was tested on a configuration that had exec-path-from-shell on it, and that flycheck might also need the exec-path variable to include the folder that contains the output for `which eslint`.
If it is not working, check the variable exec-path first and the documentation for exec-path-from-shell.

</details>

# Google Api Interaction

<details>
    <summary>If you want to use the paste google sheets component, you have to setup a some things in google first.</summary>

Instructions to get this working:

-   Go to [this link](https://console.cloud.google.com/apis), make sure you are logged in to google, then create a new project.
-   You can name it something like Undebates-Test, though the name doesn't actually matter.
-   Location of No Organization is fine.
-   After saving, select the project from the dropdown at the top.
-   Configure the consent screen. External user type, whatever name you want, use your email for the emails.
-   Click Credentials on the left.
-   Click Create Credentials at the top, then Oauth client ID.
-   Application Type will be Web application, the name can be something like Undebates Web Client.
-   Add the following to the Authorized JavaScript origins: http://localhost:3011
-   Add the following to the Authorized redirect URIs: http://localhost:3011/oauthRedirect
-   Click save.
-   Visit this url and enable it if the project has not yet been enabled: https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=<project-name>
-   It can take a few minutes for these changes to take effect.
-   Using the values from the popup, within your .bashrc file, add the following lines:

```
export GOOGLE_CLIENT_ID='<your-client-id>'
export GOOGLE_CLIENT_SECRET='<your-client-secret>'
```

The paste google sheets component should now work when running in dev (note that it doesn't work in storybook because the routes aren't running). The first time it is used,

If things are still not working after about 10 minutes, one of the above steps may have been missed.

</details>
