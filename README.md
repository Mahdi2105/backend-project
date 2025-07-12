# Northcoders News API

This portfolio project was created as part of a Digital Skills
Bootcamp in Software Engineering provided by [Northcoders]
(https://northcoders.com/)

The environment variables in this repo cannot be accessed without
.env files, to get this working, please add 2 files, .env.test and
.env.development and insert 'PGDATABASE=nc_news' and
'PGDATABASE=nc_news_test' respectively

This is a simple project containing articles written by users and
some comments. Each of the endpoints can be found in the 'app.js'
file within the 'db' folder.

HOST LINK: https://nc-project-0hto.onrender.com/api
Here you can reach the endpoints to see the table results in the
browser. e.g. https://nc-project-0hto.onrender.com/api/articles/1

The repo can be cloned from:
https://github.com/Mahdi2105/backend-project

After cloning, please follow these steps to complete the setup:

1. Install dependencies (npm i should do the trick)

2. Create 2 .env files:
   -- .env.development --> and insert:
   ----> PGDATABASE=nc_news
   -- .env.test --> and insert:
   ----> PGDATABASE=nc_news_test

3. run 'npm run setup-dbs' in the terminal

4. run 'npm run seed' in the terminal

Now you can run the code locally using 'npm run dev' or you can
run the tests by using 'npm test'
