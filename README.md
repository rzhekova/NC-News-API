## Northcoders News API

---

### Background

The NC News API is an easy-to-use REST API which which allows you to search and retrieve JSON metadata for a number of topics, articles, users, and comments.

Follow this link to the API hosted on heroku: [NC NEWS API](https://rosies-ncnews.herokuapp.com/)

### Prerequisites

- MongoDB - [Install MongoDB Community Edition — MongoDB Manual](https://docs.mongodb.com/manual/administration/install-community/)
- Node.js (v. 9.11.1 and above) - [Installing Node.js Tutorial: Using nvm on macOS and Ubuntu](https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/)
- NPM (v. 6.1.0 and above) - gets installed with Node

### Installation

Fork this repository and clone it onto your computer using the following terminal command:

```
git clone <repo url>
```

Then, `cd` into the API directory and run `npm install`, or `npm i` for short, in you terminal to install all modules listed in the package.json. This will make the following packages available to your code:

- Body-parser (v. 1.18.3) - used to process POST requests.
- Express (v. 4.16.3) - used to set up your server and routers.
- Mongoose (v. 5.2.4) - a MongoDB library that you may find extremely useful when seeding raw data into your database.
- EJS (v. 4.16.3) - helps to embed JS finctionality into HTML files.
- Chai (v. 4.1.2) - a BDD/TDD assertion library for node and the browser.
- Mocha (v. 5.2.0) - a super easy to use test-suite framework.
- Supertest (v. 3.1.0 and above) - a SuperAgent-driven library for testing HTTP servers which "listens" for you so you an carry out tests on your controllers
- Nodemon (v. 1.18.3) - simple monitor script which automatically restarts listening on a PORT when you make (and save) changes in your code

### Running the tests

In the package.json file, you'll find a list of scripts that make it easier to run certain commands.

`npm run seed:dev`
It is important to run this command first in order to seed your database with the raw data provided before using any of the other scripts. Mongod would have to be running in the background prior to seeding (i.e. type `mongod` in the command line before `npm run seed:dev`).

`npm test`
or just `npm t` will run your Mocha tests and will also seed the test data provided into a test database.

`npm run start`
This script will execute the command `node index.js` (index.js should contain your server listening functionality e.g. `app.listen()`). This, however, won't be needed during development and testing but will be needed for the production phase e.g. if you want to push your code onto Heroku.

`npm run dev`
This script will execute the command `nodemon index.js` which is perfect for when you are using e.g. [Postman](https://www.getpostman.com/) to test out various server requests.

### Setting up your config file

In the root of the API directory, create a config directory using `mkdir config` and inside it create a config file by typing `touch config.js` into your terminal.

Your config file will contain sensitive information e.g. your Mlab database username and password, and so it is important that you include it in your .gitignore file.

The config file should look something like this:

```js
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const config = {
  dev: { DB_URL: "mongodb://localhost:27017/<database>" },
  test: { DB_URL: "mongodb://localhost:27017/<test_database>" },
  production: {
    DB_URL: "mongodb://<dbusername>:<dbpassword>@<host>:<port>/<database>"
  }
};

module.exports = config[process.env.NODE_ENV];
```

### API Endpoints

```http
GET /api
```

Serves an HTML page with documentation for all the available endpoints

```http
GET /api/topics
```

Get all the topics

```http
GET /api/topics/:topic_slug/articles
```

Return all the articles for a certain topic, e.g: `/api/topics/football/articles`

```http
POST /api/topics/:topic_slug/articles
```

Add a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: `{ "title": "new article", "body": "This is my new article content"}`

```http
GET /api/articles
```

Returns all the articles

```http
GET /api/articles/:article_id
```

Get an individual article

```http
GET /api/articles/:article_id/comments
```

Get all the comments for a individual article

```http
POST /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with body and created_by key value pairs
e.g: `{"body": "This is my new comment", "created_by": <mongo id for a user>}`

```http
PUT /api/articles/:article_id
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/articles/:article_id?vote=up`

```http
PUT /api/comments/:comment_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/comments/:comment_id?vote=down`

```http
DELETE /api/comments/:comment_id
```

Deletes a comment

```http
GET /api/users
```

Returns all users

```http
GET /api/users/:username
```

e.g: `/api/users/mitch123`

Returns a JSON object with the profile data for the specified user.

### Hosting

Before pushing your app onto Heroku, ensure you have set up your database on Mlab.

- Mlab - [Setting up a free MongoDB database on mLab and connecting to it with Node.js](http://fredrik.anderzon.se/2017/01/17/setting-up-a-free-mongodb-database-on-mlab-and-connecting-to-it-with-node-js/)
- Creating a Heroku remote and deploying - [Deploying with Git | Heroku Dev Center](https://devcenter.heroku.com/articles/git)
