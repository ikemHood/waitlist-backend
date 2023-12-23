# Waitlist API

The Waitlist API is designed to manage a simple waitlist. It provides endpoints to add an email to the waitlist and retrieve all emails in the waitlist. Access to the getWaitlist endpoint is restricted and requires a auth token for authentication.

## Setup

1. Clone the repository to your local machine.
2. Run `npm install` to install all dependencies.
3. Set up your MongoDB database.
4. Create a `.env` file in the root of your project and add your mongodb url and auth token like so: `AUTH=YourSecretBearerToken MONGODB_URL=url`.
5. Start the server with `npm start`.



## API Endpoints

### POST /joinwaitlist

Add an email address to the waitlist.

#### Request

```
{
  "email": "user@example.com"
}
```

#### Response

- `200 OK` on success:

```
{
  "message": "Email added to the waitlist."
}
```

- `400 Bad Request` if the email is invalid or missing:

```
{
  "message": "Email address is required."
}
```

- `500 Internal Server Error` if there's a server error:

```
{
  "message": "Error message"
}
```


### GET /getwaitlist

Retrieve all emails in the waitlist. This endpoint requires a bearer token for authentication.

#### Request Headers

```
Authorization: Bearer YourSecretBearerToken
```

#### Response

- `200 OK` on success:

```
[
  "user1@example.com",
  "user2@example.com",
  "user3@example.com"
]
```

- `401 Unauthorized` if the bearer token is missing.
- `403 Forbidden` if the bearer token is invalid.
- `500 Internal Server Error` if there's a server error.



## Miscellaneous

All other undefined routes will return a `404 H3llo MudaFvcka` error.


## Security

This API uses bearer token authentication to protect the `/getwaitlist` endpoint. Ensure that the bearer token is kept secret and is only shared with authorized clients.

