# Guidelines for contributing to the project
## Using git
Git can be used in many different ways. The way we use it in cyb is as follows:
The main repo has three branches.

### Main
This branch is meant to represent the production state of the code. This is the branch from witch the production server will pull the source code and should therefore never have untested code.
All commits to this branch should be squash-merge commits from the [Development](#development) branch

### Development
The development branch is where the action happens. This is will be the base of your new feature branches and will also be the branch your pull-requests go to. This is a living and breathing branch and hopefully has frequent commits and merges. Because of this, you should try to keep all feature branches up to date with this branch while developing.
To make sure you always make new feature-branches from the most up-to-date development branch, we recomend setting up the cyb github repo as a remote in your local clone of your fork.
This is further described in the [Getting Started](#getting-started) section

## Getting started
Note that you'll probably only need to do these first steps once, so if you don't undersand what's happening and what stuff is doing, no worries and if you have questions about something, or issues setting up your environment, don't hesitate to ask.

### Forking the repo
To get started contributing, make a fork of the cyb repo. If you're new to git and github, forking is a feature in github, where you make your own personal copy of a repo. Here you have both read and write access and you can make whatever changes you want without affecting cyb's repo. To get your changes applied to cyb's repo you need to make a pull-request, but more on that later.

### Making a local clone of your fork
When you're done making the fork, you can "download" a clone of the repo to your local machine. This can be done though the git CLI with the following command:

```
git clone <url-to-your-fork>
```

This will create a directory on you computer containing the source-code for the project. 

### Setting up tracking of cyb development branch
From now on, you are going to make feature-branches off of the official cyb development branch. For ease of use, you can set up your local development branch to track the cyb remote's development branch and just pull the new changes before making a new branch.
To set up this tracking you first need to add the cyb remote repo as a remote in you local repo:
```
git remote add cyb https://github.com/cybernetisk/internsystem-v2.git
```
You can check that the remote was added successfully by running: 
```
git remote
```
You should see "cyb" listed along with "origin", which is the name of your remote fork on gihub that you made earlier.

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

Here is an explanation of the commands:

#### git checkout development
With this command you move to the development branch on you local computer. This will remove all code and changes you have made on you feature branches, but don't worry, running `git checkout <name-of-your-feature-branch-here>` will let you quickly go back to your feature-code.
Note that this step might cause an error if you have changes on the featurebranch that is not committed. To remedy this, commit your changes if you want them to be a part of the commit history, alternativly if you don't want to commit either because the code is not ready or you want to discard the changes, you may either:
Run a `git stash` to remove the changes you've made, but only temporarily until you run `git stash pop`. This will store your changes in a "stash" until you are ready to continue your work. Or:
You can run `git reset --hard`, but be carefull running this one as it will permenently delete the changes that are not commited.

#### git pull
This will simply get the changes that has been pushed to the development branch on the cyb repo. This is because you sat your development branch to track the cyb remote development branch. You do this to keep your local codebase up to date with the newest changes to the cyb repo, making integrating your pull-requests 10x easier for the repo maintainers.
Note that running this command should result in a fast forward merge and if you encounter a merge conflict, this is probably because you have made changes to your local development branch (which is thouroughly not recomended). If you encounter a merge conflict here you can make a new branch from your current local development branch, switch back to your development branch and then do a `git reset --hard <commit-hash-of-cyb-head>`. The commit hash of cyb head can be found by running `git log` while on the development branch.

#### git checkout -b <feature-branch-name>
Given that you have successfully updated your development branch with the last command, this command should create a new branch with the name you provide. Use good descriptive names on your branches to make it clear what the content of the branch is. Note that this will not make a branch on you github repo, only your local repo. This will be adressed in the next step.

#### git push -u origin <feature-branch-name>
This command will take the state of the branch you are on, pressumably your new feature branch, and push it to a branch on your github repo with the name you provide. It is recomended that this name is the same as the name for your local branch to avoid confusion when handling the branches later on. If the branch does not exist on the remote repo (on github) it will be created and any changes on the local repo will be pushed to the new remote branch.

#### Now you have created a feature branch!
Now you have created a feature branch. While working on the code for the feature, remember to commit often and provide descriptive and short commit messages for the changes made in the commit. When you want to upload the code changes to your github repo, just run `git push` and the code will be sent on its way. This is not the same as making a pull-request tho. See [Creating a pull-request](#creating-a-pull-request) for more info on publishing your code to the cyb repo.

### Creating a pull-request
When you have created a feature branch, you probably want the features you implemented to become a part of the codebase. To do this you can use a pull-request. This can be done in a couple different ways.
One way is to go to your fork of the cyb repo in github, go to the branch you want to make a pull-request for. There should be some sort of contribute/make pull-request button at the top of the page. If you click this, you will be braught to the pull-request page on cyb's repo.
Another path to the pull requests page, is to go to the pull-request tab on cyb's repo and click "new pull request". 

In both of these cases you will need to make sure that you are creating a pull-request between the correct branches. There should be four dropdown boxes: "base-repository", "base", "head-repository" and "compare". If you don't get these four but only "base" and "compare", you need to click the "compare accross forks" link above the dropdowns.
Once you are presented with four dropdowns, you'll need to make sure the first two, the base-repository and base boxes, are set to cybernetisk/internsystem-v2 and developmlent respectivly. For the last two, head-repository and compare, you'll need to set them to your fork of the repo and the feature branch you want to make a pull-request for.

If you are working on a larger feature with many commits, we want you to make a draft-pull-request while working on the feature. You do this in the same way as making a normal pull-request, but you may be prompted at some point if you want to make the pull-request a draft pull-request. Alternativly you can always make a normal pull-request and then later open the pull-request page and click the "Convert to draft" button on the right under the header "Reviewers"

### Setting up a local database (optional)
If you want to make changes to the database in you feature, you probably don't want to make changes to the same dev database everybody else are using. To work around this you can set up your own instance of the database. The easiest way to do this is to set up a docker container
First of all you will need to have docker installed. Once it is installed you can create a docker container from the MYSQL image as follows:
```
docker run --name cybDatabase -e MYSQL_ROOT_PASSWORD='<Strong password here>' -p 3306:3306 -d mysql:latest 
```

This should create a docker container running a mysql server on your machine. If you have never run a mysql docker container before, it might take some time for the image to download from dockerhub and you may get an error saying that you dont have the mysql image downloaded, it which case you can search for "mysql docker" and find the command for installing the image on the page called dockerhub.

When the container is up and running all you need to do is change som variables in your projects .env.development.local file. Specifically you need to update the following variables
```
DATABASE_USER = 'root'
DATABASE_PASS = '<Your strong database password>'
DATABASE_SCHEMA = 'public'
DATABASE_URL = "mysql://${DATABASE_USER}:${DATABASE_PASS}@localhost:3306/${DATABASE_SCHEMA}"
```
Note that the only difference in the DATABASE_URL between using the dev database and your own database is only the port number, so make sure it is correct before continuing

Last thing you need to change to be done setting up your database is to generate all the tables the application needs. This can be done by running a singe command while standing in the project directory: 
```
npm run prismapush
```