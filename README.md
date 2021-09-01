# Undebate Self Service Portal

This project creates a portal that allows people to create their own [undebates](https://github.com/EnCiv/undebate) for electitons for their organization - for example a University Student Body might want to have undebates by the candidates for student body office like president and vice president and such.

**Copyright 2021 EnCiv, Inc.** This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/undebate/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition

# Getting Started
```
npm clone https://github.com/EnCiv/undebate-ssp.git
cd undebate-ssp
npm install
npm run storybook
```
A storybook browser window will open up.

This is the beginning phase of the project.  We are creating React components based on UI design in [figma](https://www.figma.com/proto/IQKPx02pkBErpmhQoECoq9/Undebate?node-id=123%3A1694&scaling=min-zoom&page-id=102%3A2&starting-point-node-id=123%3A1694)

We are breaking the UI down into React components, and are creating [issues](https://github.com/EnCiv/undebate-ssp/issues) for each component.

Each component goes into app/components
For each component we will also build a story in stories/

The [unpoll](github.com/EnCiv/unpoll) repo has examples of app/components and stories - it follows this same structure.

## Notes on React component guidelines:

These notes are pretty general and always open to reevaluation. Also, we want to say the why about each guideline. 

1. This project is using React-jss for styles, and they should be at the bottom of the file. -- It's efficient to have all the code and style for a component in one place.
2. To make components reposive, do not use 'px'.  It's really frustrating that figma shows everthing in px, but we need to convert this to 'rem', 'em', 'vw', or 'vh' as appropriate to make the components responsive. In most of the figma I've seen, a rem is 16px. The only exception to the no 'px' rule is for borders - it's find to make a border '1px'. But it it gets bigger than that - use rem. 
3. Most components should take their width from the parent - not set the width. They should figure out their padding or margin as necessary (in 'rem' usually). Consider that these components are going to run on large screens where the font size is 16 or more and small screens where the font size is 8 or less. There are exceptions. 
4. File names should be all lowercase, use '-' between words, and end in .js (.jsx isn't needed). Some OS's are case sensitive others are not. 
5. Within the stories.js file for a component, create multiple stories that exercise the functionality of the component. - New people are going to come back to the story to see how the component works - or to test it for some new situation. 
6. Include a link to the github issue as a comment at the top of the component file and the top of the story to make it easier to go back and reference it.  Also, we should add comments to the issues as we make design decisions that change the original direction in the issue. - We end up putting a lot of good info, and pictures, into the issue and its useful to have it handy even after the issue is closed.

## Notes on git
When starting to work on a new issue:
```
git checkout main
git pull
git checkout -b issue-name#nn
```
Where `issue-name#nn` is like `election-date-input#7` for issue [#7](https://github.com/EnCiv/undebate-ssp/issues/7)

You don't have to include all the words if it's too long. For example `election-date#7` would be fine too.  This makes it easiy to find the issue and close it when reviewing the pull request.

After the new component is working great, you can push it to the repo:
```
git push -u origin issue-name#nn
```
This will push your branch, under that name to the github repo.  After you've done this once, you can just use
```
git push origin
```
to update what's on github.

When the code is ready to merge, go to github.com/EnCiv/undebate-ssp and create a pull request for it.  When you go there - there will probably a note at the top asking if you want to create a pull request.










