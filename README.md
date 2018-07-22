## Northcoders News API

### Background

The NC News API is an easy-to-use REST API which which allows you to search and retrieve JSON metadata for a number of topics, articles, users, and comments.

Follow this link to the API hosted on heroku: [NC NEWS API](https://rosies-ncnews.herokuapp.com/)

### Prerequisites

- MongoDB - [Install MongoDB Community Edition — MongoDB Manual](https://docs.mongodb.com/manual/administration/install-community/)

### Installation

Fork this repository and clone it onto your computer using the following terminal command:

```
git clone <repo url>
```

Then, `cd` into the API directory as you will then also need to install a few Node packages.

```
npm i body-parser ejs express mongoose
```

Run this command to install all four of these libraries at the same time.

- Body-parser (v. 1.18.3) - used to process POST requests.
- Express (v. 4.16.3) - used to set up your server and routers.
- Mongoose (v. 5.2.4) - a MongoDB library that you may find extremely useful when seeding raw data into your database.
- EJS (v. 4.16.3) - helps to embed JS finctionality into HTML files.

Apart from the above mentioned packages, you will also need a few devDependencies which will be used for testing purposes. Run the command below which will save then under devDependencies in the package.json file:

```
npm i chai mocha supertest nodemon -D
```

- Chai (v. 4.1.2) - a BDD/TDD assertion library for node and the browser.
- Mocha (v. 5.2.0) - a super easy to use test-suite framework.
- Supertest (v. 3.1.0 and above) - a SuperAgent-driven library for testing HTTP servers which "listens" for you so you an carry out tests on your controllers
- Nodemon (v. 1.18.3) - simple monitor script which automatically restarts listening on a PORT when you make (and save) changes in your code

### Running the tests

In the package.json file, you'll find a list of scripts that make it easier to run certain commands.

`npm test`
or just `npm t` will run your Mocha tests.

`npm run start`
This script will execute the command `node index.js` (index.js should contain your server listening functionality e.g. `app.listen()`). This, however, won't be needed during development and testing but will be needed for the production phase e.g. if you want to push your code onto Heroku.
`npm run dev`
This script will execute the command `nodemon index.js` which is perfect for when using e.g. [Postman](https://www.getpostman.com/) to test out various server requests.

`npm run seed:dev`
Run this in order to seed your database with the raw data provided

### Setting up your config file

In the root of the API directory, create a config directory using `mkdir config` and inside it create a config file by typing `touch config.js` into your terminal.

Your config file will contain sensitive information e.g. your Mlab database username and password, and so it is important that you include it in your .gitignore file.

The config object should look something like this:

```js
const config = {
  dev: { DB_URL: "mongodb://localhost:27017/<database>" },
  test: { DB_URL: "mongodb://localhost:27017/<test_database>" },
  production: {
    DB_URL: "mongodb://<dbusername>:<dbpassword>@<host>:<port>/<database>"
  }
};
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
POST /api/topics/:topic_id/articles
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
GET /api/users/:username
```

e.g: `/api/users/mitch123`

Returns a JSON object with the profile data for the specified user.

### Hosting

- Creating a Heroku remote and deploying - [Deploying with Git | Heroku Dev Center](https://devcenter.heroku.com/articles/git)
- Mlab - [Setting up a free MongoDB database on mLab and connecting to it with Node.js](http://fredrik.anderzon.se/2017/01/17/setting-up-a-free-mongodb-database-on-mlab-and-connecting-to-it-with-node-js/)
