# Task List Project 🚀

Task list application built with Node.js, Express, EJS, and MongoDB. This project was created to practice MVC architecture, session-based authentication, CSRF protection, and per-user task CRUD.

## Overview ✨

- User registration and login.
- Authenticated sessions stored in MongoDB.
- Create, edit, and delete tasks.
- Task organization by status: pending, in progress, and completed.
- CSRF protection.
- Flash messages for success and error feedback.

## Tech Stack 🛠️

- Node.js
- Express
- MongoDB and Mongoose
- EJS
- express-session and connect-mongo
- connect-flash
- csurf
- Webpack + Babel

## Requirements 📌

- Node.js 18+ recommended
- MongoDB accessible locally or through a remote connection string

## Installation 📦

```bash
npm install
```

## Configuration ⚙️

Create a `.env` file in the project root with the variables below:

```env
CONNECTION_STRING=your_mongodb_connection_string
SESSION_SECRET=a_strong_secret_key
```

## Running the Project ▶️

In one terminal, start the server:

```bash
npm start
```

In another terminal, keep the front-end bundle in watch mode:

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Scripts 📜

- `npm start`: starts the server with `nodemon`.
- `npm run dev`: rebuilds assets with Webpack in watch mode.

## Implemented Features ✅

- Landing page with project presentation.
- User authentication with registration and login.
- Logout with session destruction.
- Task list filtered by the logged-in user.
- Task editing and deletion.
- Basic backend field validation.

## Project Structure 🧱

- `server.js`: server bootstrap, session, CSRF, and database connection.
- `routes.js`: route definitions.
- `src/controllers`: controller logic.
- `src/models`: Mongoose models and validation.
- `src/views`: EJS pages.
- `frontend`: bundle entry point and styling.
- `public`: static assets.

## Notes 📝

- Some screens show UI actions like forgot my password, google login, linkedin login, that are not used in backend.
- `helmet` is prepared but commented out in `server.js`.
