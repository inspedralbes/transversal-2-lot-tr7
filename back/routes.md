# ROUTES

### Route: /api/register

POST: {
"username": "pedra",
"email": "pedra@inspedralbes.cat",
"password": "pedra",
"password_confirmation": "pedra"
}

GET: true

---

### Route: /api/login

POST: {
"username": "pedra",
"password": "pedra"
}

GET: {
"login": true,
"token": "8|3IL0WiG6KB8c3pXW7pXK2D3kir0qNpyNKsSOX65r"
}

---

### Route: /api/user-profile

POST: 8|3IL0WiG6KB8c3pXW7pXK2D3kir0qNpyNKsSOX65r

GET: {
"userData": {
"id": 2,
"username": "pedra",
"email": "pedra@inspedralbes.cat",
"level": 0,
"created_at": "2022-11-30T08:07:53.000000Z",
"updated_at": "2022-11-30T08:07:53.000000Z"
}
}

---
