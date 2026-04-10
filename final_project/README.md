IBM Developing Back-End Apps with Node.js and Express Final Project

Run the project from this folder:

```powershell
npm.cmd install
node index.js
```

Base URL:

`http://127.0.0.1:5000`

Implemented course endpoints:

- `POST /register`
- `GET /`
- `GET /isbn/:isbn`
- `GET /author/:author`
- `GET /title/:title`
- `GET /review/:isbn`
- `POST /customer/login`
- `PUT /customer/auth/review/:isbn`
- `DELETE /customer/auth/review/:isbn`

Async and Promise task endpoints:

- `GET /async/books`
- `GET /promise/isbn/:isbn`
- `GET /promise/author/:author`
- `GET /async/title/:title`
