# Management System Backend

## Dependencies

- bcryptjs
- body-parser
- cors
- dot-env
- express
- jsonwebtoken
- moment
- mongodb
- mongoose
- uuid

> Any questions or suggestions please discuss in the backend channel on discord.

## File Structure

- /src

  - /src/index.js (Main server file)
  - /src/data (This is for anything database related)
  - /src/routes (This is for managing the routes)
  - /src/utils (This is for functions that will be used in multiple places)
  - /src/models (This is for all schemas)

> Any questions or suggestions please discuss in the backend channel on discord

## System Notices

- Email address: managementsystemsmern@gmail.com

## API

### Schema

- User

```javascript
{
  id: UUID,
  email: String,
  password: String,
  createdDate: Date,
  activationKey: UUID,
  activatedDateTime: Date,
  lastUpdated: Date,
  isDeleted: Boolean
}
```

- User Profile

```javascript
{
  id: String,
  userId: String,
  firstName: String,
  lastName: String,
  userName: String,
  userStatus: String,
  lastActivity: Date,
}
```

- User Key

```javascript
{
  key: UUID,
  userId: UUID,
  keyType: String
}
```

- Key Types include:
  - 'forgot-password'
  - 'team-invite'

### Authentication

#### Registration - `POST /api/users`

```javascript
// Request Body
{
  email: "string",
  password: "string"
}
```

- Password Strength

  - Requires Min 8 characters
  - Requires 1 uppercase letter
  - Requires 1 number

```javascript
// Response

200: "Successful Registration"

400: "Missing either email or password in request body"

404: "Password does not meet requirements"

404: "Activation code already used"
```

---

#### Activation - `GET /api/activation/:activationCode`

```javascript
// Response Status Codes
200: "Successful activation"

400: "activationCode parameter missing"

404: "No activation code found"
```

---

#### Login - `POST /api/login`

```javascript
// Request Body
{
  email: String,
  password: String
}
```

```javascript
// Response Body
{
  token
}
```

```javascript
// Response Status Codes
200: "Successful Login"

400: "Missing email or password in request body"

404: "Incorrect username or password"
```
