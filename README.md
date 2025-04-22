# 🗓️ GraphQL Event Manager

A simple Node.js + Express + GraphQL backend for managing events, users, and authentication — with MongoDB as the database. Fully Dockerized for easy deployment.

---

## 📦 Tech Stack

- **Node.js**
- **Express**
- **GraphQL** (`express-graphql`)
- **MongoDB Atlas**
- **Mongoose**
- **JWT Authentication**
- **Docker**

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or a local MongoDB instance)
- Docker (optional, for containerization)

---

## 🛠️ Local Development (without Docker)

### 1. Clone the Repo

```bash
git clone https://github.com/rahsuttank/graphql-event-manager.git
cd graphql-event-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the root directory with the following variables:

```env
MONGO_USER=your_mongo_user
MONGO_PASSWORD=your_mongo_password
MONGO_DB=your_database_name
```

### 4. Run the App

```bash
npm start
```

The server will be available at: [http://localhost:3000/graphqlApi](http://localhost:3000/graphqlApi)

---

## 🐳 Docker Setup

### 1. Build Docker Image

```bash
docker build -t graphql-event-manager .
```

### 2. Run the Container

```bash
docker run -p 3000:3000 --env-file .env graphql-event-manager
```

If port `3000` is in use, try:

```bash
docker run -p 4000:3000 --env-file .env graphql-event-manager
```

### 3. Access GraphQL Playground

Open: [http://localhost:3000/graphqlApi](http://localhost:3000/graphqlApi)

---

## 📁 Project Structure

```
graphql-event-manager/
├── graphql/
│   ├── resolver/
│   └── schema/
├── middleware/
│   └── is-auth.js
├── app.js
├── package.json
├── Dockerfile
├── .dockerignore
└── .env  (you create this)
```

---

## 🧪 Example Queries

### Create User

```graphql
mutation {
  createUser(userInput: { email: "test@test.com", password: "password" }) {
    _id
    email
  }
}
```

### Create Event (requires auth token)

```graphql
mutation {
  createEvent(eventInput: {
    title: "GraphQL 101",
    description: "Intro to GraphQL",
    price: 10.5,
    date: "2025-04-17T12:00:00.000Z"
  }) {
    _id
    title
  }
}
```

---

## ✅ TODOs / Improvements

- Add unit tests
- Add pagination and filtering
- Add input validation
- Use TypeScript (optional)

---

## 🧾 License

MIT © 2025 Tushar Tank
