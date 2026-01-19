# Digi Auth API Documentation

Complete API documentation for Digi Auth Service - Authentication Microservice

**Base URL:** `http://localhost:3000`

---

## Table of Contents

1. [Health Check](#health-check)
2. [Authentication Endpoints](#authentication-endpoints)
   - [Register User](#register-user)
   - [Login](#login)
   - [Refresh Token](#refresh-token)
   - [Logout](#logout)
3. [User Profile Endpoints](#user-profile-endpoints)
   - [Get Profile](#get-profile)
   - [Update Profile](#update-profile)

---

## Health Check

### Check Server Status

Check if the server is running and healthy.

**Endpoint:** `GET /health`

**Headers:** None

**Request Body:** None

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-12-02T07:09:05.579Z"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

## Authentication Endpoints

### Register User

Register a new user account. Returns access token and refresh token.

**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "Test123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Field Validation:**
- `email` (required): Valid email format
- `password` (required): Minimum 8 characters, maximum 100 characters
- `firstName` (required): Minimum 2 characters, maximum 50 characters
- `lastName` (required): Minimum 2 characters, maximum 50 characters

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "94efa926-60c3-483c-83d7-3190eac47395",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "isActive": true,
      "createdAt": "2025-12-02T07:09:09.926Z",
      "updatedAt": "2025-12-02T07:09:09.926Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Codes:**
- `201 Created` - User registered successfully
- `409 Conflict` - User with this email already exists
- `400 Bad Request` - Validation error

---

### Login

Login with email and password. Returns access token and refresh token.

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

**Field Validation:**
- `email` (required): Valid email format
- `password` (required): Minimum 1 character

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "94efa926-60c3-483c-83d7-3190eac47395",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "isActive": true,
      "createdAt": "2025-12-02T07:09:09.926Z",
      "updatedAt": "2025-12-02T07:09:09.926Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Codes:**
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials or user deactivated
- `400 Bad Request` - Validation error

---

### Refresh Token

Refresh the access token using a valid refresh token. Returns a new access token and a new refresh token (token rotation).

**Endpoint:** `POST /api/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Field Validation:**
- `refreshToken` (required): Valid refresh token string

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Codes:**
- `200 OK` - Token refreshed successfully
- `401 Unauthorized` - Invalid or expired refresh token
- `400 Bad Request` - Validation error

**Note:** The refresh token is rotated (a new refresh token is generated) for security purposes.

---

### Logout

Logout and blacklist the current access token.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:** None

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Status Codes:**
- `200 OK` - Logout successful
- `401 Unauthorized` - Invalid or missing token

**Note:** After logout, the access token is blacklisted and cannot be used for subsequent requests.

---

## User Profile Endpoints

### Get Profile

Get the authenticated user's profile information. Requires authentication.

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:** None

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "94efa926-60c3-483c-83d7-3190eac47395",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2025-12-02T07:09:09.926Z",
    "updatedAt": "2025-12-02T07:09:09.926Z"
  }
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Invalid or missing token

---

### Update Profile

Update the authenticated user's profile. Requires authentication. All fields are optional.

**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Field Validation:**
- `firstName` (optional): Minimum 2 characters, maximum 50 characters
- `lastName` (optional): Minimum 2 characters, maximum 50 characters

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "94efa926-60c3-483c-83d7-3190eac47395",
    "email": "test@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "fullName": "Jane Smith",
    "isActive": true,
    "createdAt": "2025-12-02T07:09:09.926Z",
    "updatedAt": "2025-12-02T07:09:39.476Z"
  }
}
```

**Status Codes:**
- `200 OK` - Profile updated successfully
- `401 Unauthorized` - Invalid or missing token
- `400 Bad Request` - Validation error

**Note:** You can update either `firstName`, `lastName`, or both. Only provided fields will be updated.

---

## Authentication

Most endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer {accessToken}
```

The access token is obtained from:
- Register endpoint (after successful registration)
- Login endpoint (after successful login)
- Refresh token endpoint (after token refresh)

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message description",
  "error": "Detailed error information"
}
```

**Common Status Codes:**
- `400 Bad Request` - Validation errors or invalid request
- `401 Unauthorized` - Authentication required or invalid credentials
- `409 Conflict` - Resource conflict (e.g., email already exists)
- `500 Internal Server Error` - Server error

---

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you will receive a `429 Too Many Requests` response.

---

## Notes

1. **Token Expiration:**
   - Access tokens have a shorter expiration time
   - Refresh tokens have a longer expiration time
   - Use the refresh token endpoint to obtain new tokens before expiration

2. **Token Rotation:**
   - The refresh token endpoint implements token rotation for security
   - A new refresh token is generated each time you refresh your access token

3. **Password Requirements:**
   - Minimum 8 characters
   - Maximum 100 characters

4. **Email Validation:**
   - Must be a valid email format

5. **Name Requirements:**
   - First name and last name must be between 2-50 characters

---

## Example Usage Flow

1. **Register a new user:**
   ```bash
   POST /api/auth/register
   # Returns: accessToken, refreshToken, user data
   ```

2. **Use access token for authenticated requests:**
   ```bash
   GET /api/users/profile
   Authorization: Bearer {accessToken}
   ```

3. **When access token expires, refresh it:**
   ```bash
   POST /api/auth/refresh
   # Returns: new accessToken, new refreshToken
   ```

4. **Logout when done:**
   ```bash
   POST /api/auth/logout
   Authorization: Bearer {accessToken}
   ```

---

**Last Updated:** December 2, 2025

