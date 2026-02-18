# http_server_practice
Practicing setting up a Node.js server using Typescript.

## User Resource

```json
{
    "id": "fe7c8fea-7f18-4644-b980-b5a76ed26309",
    "email": "Alice@example.com",
    "isChirpyRed": false,
}
```

### POST /api/users

Request body:

```json
{
    "email": "Alice@example.com",
    "password": "SuperStrongPassword1234!",
}
```

Response body:

```json
{
    "id": "fe7c8fea-7f18-4644-b980-b5a76ed26309",
    "createdAt": "2026-02-17T09:54:49.092Z",
    "updatedAt": "2026-02-17T09:54:49.092Z",
    "email": "Alice@example.com",
    "isChirpyRed": false,
}
```

### PUT /api/users

Allows an existing user to change their email and/or password

Request body:

```json
{
    "email": "Alice2@newdomain.com",
    "password": "NewSuperStrongPassword1234!",
}
```

Response body:

```json
{
    "id": "fe7c8fea-7f18-4644-b980-b5a76ed26309",
    "createdAt": "2026-02-17T09:54:49.092Z",
    "updatedAt": "2026-02-17T09:54:49.092Z",
    "email": "Alice@newdomain.com",
    "isChirpyRed": false,
}
```

## Chirps

Posts (chirps) are stored in the database

### POST /api/chirps

Request Body:

```json
{
    "body": "Example post"
}
```

Response body:

```json
{
    "body": "Example post",
    "createdAt": "2026-02-17T09:54:49.545Z",
    "id": "c682e172-2676-4f04-90a9-612dfd2df7ac",
    "updatedAt": "2026-02-17T09:54:49.545Z",
    "userId": "9b7e4be6-ae5f-486f-bd05-379c648a0254"
}
```

### GET /api/chirps

Returns an array of all chirps in database

### GET /api/chirps/:chirpId

Returns a single chirp by ID.

### GET /api/chirps?authorId=xx

Returns an array of all chirps by author

### DELETE /api/chirps/:chirpId

Deletes a chirp by ID.