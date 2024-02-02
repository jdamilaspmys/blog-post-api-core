# Blog Post API Core

This project is a Node.js ExpressJs application for a blog post API with MongoDB and JWT token authentication.

## Prerequisites

- Node.js installed (https://nodejs.org/)
- MongoDB installed and running (https://www.mongodb.com/)

## Getting Started

Clone the repository:
```bash
git clone https://github.com/jdamilaspmys/blog-post-api-core.git

```
Navigate to the project directory:
```
cd blog-post-api-core
```

Install dependencies:
```
npm install
```

Create a .env file in the project root and add the following environment variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_jwt_secret_key` with your JWT secret key.

Start the server:
```
npm start
```
The API server will run on http://localhost:3000 (or the port you specified in the .env file).

Scripts

- npm start: Start the server using the ./bin/www script.


Dependencies
# Project Dependencies

The following is a list of dependencies used in this project:

1. **bcrypt** : Password hashing library.
2. **dotenv** : Loads environment variables from a .env file.
3. **jsonwebtoken** : JSON Web Token authentication.
4. **mongoose** : MongoDB object modeling for Node.js.
5. **uuid** : Generate unique identifiers.


Support : jdamilaspmys@gmail.com
