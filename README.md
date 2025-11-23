📌 Project Setup Instructions (Simplified)

First, import the repo into your system.

Create a new Oracle user:

Example:

CREATE USER Project IDENTIFIED BY 123;


Grant it the same access/permissions used in Lab Demo 3.

In the backend file dbConfig.js, confirm that:

Username = Project

Password = 123

(Both are case-sensitive)

Now create your database:

Open sqlplus

Login as user Project

Run all SQL queries/scripts

Ensure every query runs without runtime errors

You can also visually check all tables and objects in DBeaver Community Edition.

Backend setup:

In the backend folder, run:

npm install
npm start


Server should start and show “connected to Oracle database”

Test endpoints → open:

http://localhost:5000/api/<filename>


Frontend setup:

Install dependencies:

npm install
npm install axios


Then start the frontend:

npm start


To run the project completely:

Open two terminals

Terminal 1 → run backend

Terminal 2 → run frontend

Rules:

Schema should NOT be changed

If you change datatypes, triggers, fix issues, etc → write them down clearly

Your teammate needs these notes to update their database

Current users (doctors / admin / etc.) already exist in the database → use them to log in and test pages

Leave registration & authentication for the end, because it’s buggy and time-consuming

When committing files:

Commit with clear, detailed messages

This makes it easy for your teammate to know what changed

Work plan:

Start fixing the doctor pages first

Then move to patient pages, etc.

Most backend errors appear directly in the Node.js terminal — check there when debugging.
