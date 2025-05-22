
# 🌀 GraphQl

This project is a frontend web application that fetches and visualizes user skills from the [Zone01 Oujda](https://learn.zone01oujda.ma) platform using SVG-based circular charts.

---

## 🚀 Features

- 🔐 **JWT Authentication** with Zone01 API.
- 📊 **Dynamic SVG Visualization** of user skills (circular progress arcs).
- 🔎 **GraphQL integration** to fetch user XP, levels, transactions, and more.
- ⚙️ Modular utility functions for UI elements (`createelment.js`).

---

## 📁 Project Structure

```
/graphql
│
├── app.js                # Entry point: loads main app or login depending on JWT
├── api.js                # API helpers: fetchJWT() and fetchUser() via GraphQL
├── createelment.js       # Utility functions to create & extend DOM elements
├── ui.js                 # (Expected) Manages DOM display functions like showApp(), showLogin()
├── styles.css            # (Optional) Styles for SVG and page layout
├── README.md             # Project documentation (this file)
├── index.html            # Main HTML page
```

---

## 🔐 Authentication

The app uses **Basic Auth** to fetch a JWT from the Zone01 API, then stores it in `localStorage`.

```js
const res = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(user + ':' + pass)}`
  }
});
```

This token is later used for authenticated GraphQL queries.

---

## 📡 GraphQL Querying

GraphQL queries are sent to the Zone01 endpoint:

```
https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql
```

Example functions:
- `fetchUser(query)` — sends a custom GraphQL query with the stored JWT.
- `fetchJWT(user, pass)` — authenticates the user and retrieves JWT.

---

## 🧱 Custom Element Helpers

Inside `createelment.js`, reusable DOM builders are defined:
- `ce(tag, className, textContent)`
- `input(type, placeholder)`
- `button(className, textContent)`
- Extended methods: `.setAtr()`, `.append()`, `.setText()`

This makes UI creation easier and more readable.

---

## 📦 Dependencies

This project uses only **Vanilla JavaScript** (no frameworks).

To run it:
- You only need a browser.
- For local development, use **Live Server** or a simple HTTP server (like Python’s or Node).

---

## 💡 Usage

1. Clone or download the repo.
2. Start a local server.
3. Open `index.html` in the browser.
4. Login with Zone01 credentials.
5. View your skill circles and XP stats.

---

## 🧑‍💻 Author

**Jamal Bajady**   
GitHub: [@jamalbajady](https://github.com/jbajady)  

---
