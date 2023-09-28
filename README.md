# JetConnect API
JetConnect is a web application API that allows users to book and manage flight tickets online. The API is built using the MERN stack (MongoDB, Express, React, and Node.js) with a microservice architecture. This is a personal project aimed at increasing my backend development knowledge and enhancing my programming skills.

## Aim
The aim of the JetConnect API is to create an efficient and secure ticket booking system that provides users with a seamless experience. The API enables users to search for flights, book tickets, view and modify their bookings, and make payments securely.

## Technologies
- Express.js
- MongoDB
- Node.js

## Main File (App.js)
The main file, `App.js`, sets up the server and includes middleware for security, rate limiting, data sanitization, compression, and logging. It also specifies the routes for users, flights, and bookings.

### Security
The app uses several packages to enhance security:
- `helmet` for setting HTTP headers
- `express-rate-limit` for limiting requests
- `express-mongo-sanitize` for data sanitization against NoSQL query injection
- `xss-clean` for data sanitization against cross-site scripting (XSS) attacks
- `hpp` for protection against HTTP Parameter Pollution attacks

### Compression
The `compression` package is used to compress HTTP responses.

### Logging
The `morgan` package is used for logging in development.

### Routes
The following routes are defined:
- `https://jetconnect.onrender.com/api/v1/users`: User-related routes
- `https://jetconnect.onrender.com/api/v1/flights`: Flight-related routes
- `https://jetconnect.onrender.com/api/v1/bookings`: Booking-related routes

## Usage
To use the API, send requests to the appropriate routes with the required parameters. For example, to fetch all flights, you might send a GET request to `https://jetconnect.onrender.com/api/v1/flights`. To add a new booking, you might send a POST request to `https://jetconnect.onrender.com/api/v1/bookings` with the booking details in the request body.
