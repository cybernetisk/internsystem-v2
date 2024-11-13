# Guidelines for contributing to the project
## Using git
Git can be used in many different ways. The way we use it in cyb is as follows:
The main repo has three branches.

### Main
This branch is meant to represent the production state of the code. This is the branch from witch the production server will pull the source code and should therefore never have untested code.
All commits to this branch should be squash-merge commits from the Staging branch

### Staging
This branch is the "polishing" branch. It contains code that should be tested and polished before being merged into main.
The branch will contain all and only commits from the development branch and should not be commited to directly, only through merges with the development branch

### Development
The development branch is where the action happens. This is will be the base of your new branches and will also be the branch your pull-requests go to. This is a living and breathing branch and hopefulle hasd frequent commits and merges. Because of this, you should try to keep all feature branches up to date with this branch while developing.
To make sure you always make new feature-branches from the most up-to-date development branch, we recomend setting up the cyb github repo as a remote in your local clone of your fork.
This is further described in the [Getting Started](#getting-started) section

## Getting started

### Forking the repo
To get started contributing, make a fork of the cyb repo. If you're new to git and github, forking is a feature in github, where you make your own clone of a repo where you have both read and write access, where you can make whatever changes you want without affecting cyb's repo. To get your changes to be applied to the cyb's repo you need to make a pull-request, but more on that later.

### Making a local clone of your fork
When you're done making the fork, you can "download" a clone of the repo to your local machine. This can be done though the git CLI with the following command:
```
git clone <url-to-your-repo>
```

This will create a folder on you computer containing the source-code for the project

### Setting up tracking of cyb development branch
From now on, you are going to make feature-branches from the official cyb development branch. For ease of use, you can set up your local development branch to track the cyb remote's development branch and just pull the new changes before making a new branch.
To set up this tracking you first need to add the cyb repo as a remote in you local repo:
```
git remote add cyb https://github.com/cybernetisk/internsystem-v2.git
```
You can check that the remote was added successfully by running: 
```
git remote
```
You should see "cyb" listed along with "origin", which is your remote fork of the repo that you have on github

Now we need to set up your local development branch and set it to track cyb/development
First you'll need to fetch the branches from cyb by running
```
git fetch cyb
```
Now you can finaly set up your local development branch with the command:
```
git checkout -b development --track cyb/development
```

You can check if this worked by running
```
git branch --format "%(refname:short) - %(upstream:short)"
```
You should see a line:
```
development - cyb/development
```

### Creating new feature branches
This step is pretty simple, just run these commands to make sure you start the branch from an updated development branch and push to your own remote
```
git checkout development
git pull
git checkout -b <feature-branch-name>
git push -u origin <feature-branch-name>
```