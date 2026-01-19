# Authentication Microservice

A complete authentication microservice built with **TypeScript** and **Clean Architecture** principles. This service provides user registration, login, JWT-based authentication, token management, and user profile operations.

## 🏗️ Architecture

This project follows **Clean Architecture** with clear separation of concerns across four main layers:

```
src/
├── domain/              # Enterprise business rules (entities, interfaces)
├── application/         # Application business rules (use cases, DTOs)
├── infrastructure/      # External agencies (database, services, config)
└── presentation/        # Interface adapters (controllers, routes, middleware)
```

### Key Principles

- **Dependency Inversion**: Dependencies point inward (Presentation → Application → Domain)
- **Independence**: Domain layer has zero external dependencies
- **Testability**: Business logic is decoupled from frameworks
- **Maintainability**: Clear separation makes the codebase easy to understand and modify

## 🚀 Features

- ✅ User registration with email validation
- ✅ Login with JWT token generation
- ✅ Access token and refresh token mechanism
- ✅ User profile retrieval and updates
- ✅ Password hashing with bcrypt
- ✅ Request validation with class-validator
- ✅ Comprehensive error handling
- ✅ Docker support with PostgreSQL
- ✅ Clean Architecture structure

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (client-side token removal)

### User Profile (requires authentication)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Health Check
- `GET /health` - Service health status

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: class-validator & class-transformer
- **Containerization**: Docker & Docker Compose

## 📦 Installation

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL (or use Docker)
- Git

### Local Development

1. **Clone or navigate to the repository**
   ```bash
   cd /Users/rajesh/Documents/digi_auth_services
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env` file has been created for you. Update it if needed:
   ```bash
   # Edit database credentials, JWT secrets, etc.
   nano .env
   ```

4. **Start PostgreSQL** (if not using Docker)
   
   Make sure PostgreSQL is running and the database exists:
   ```sql
   CREATE DATABASE auth_service;
   ```

5. **Run in development mode**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

### Using Docker

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Auth service on port 3000

2. **View logs**
   ```bash
   docker-compose logs -f auth-service
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `DB_DATABASE` | Database name | auth_service |
| `JWT_ACCESS_SECRET` | Secret for access tokens | (change in production) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | (change in production) |
| `JWT_ACCESS_EXPIRATION` | Access token expiry | 15m |
| `JWT_REFRESH_EXPIRATION` | Refresh token expiry | 7d |
| `BCRYPT_SALT_ROUNDS` | Bcrypt salt rounds | 10 |

## 🧪 Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Get User Profile

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 📁 Project Structure

```
digi_auth_services/
├── src/
│   ├── domain/                      # Domain layer (business entities)
│   │   ├── entities/
│   │   │   └── User.ts             # User entity with business logic
│   │   ├── repositories/
│   │   │   └── IUserRepository.ts  # Repository interface
│   │   └── value-objects/
│   │       └── Email.ts            # Email value object
│   ├── application/                 # Application layer (use cases)
│   │   ├── use-cases/
│   │   │   ├── RegisterUserUseCase.ts
│   │   │   ├── LoginUserUseCase.ts
│   │   │   ├── RefreshTokenUseCase.ts
│   │   │   ├── GetUserProfileUseCase.ts
│   │   │   └── UpdateUserProfileUseCase.ts
│   │   ├── dtos/
│   │   │   └── index.ts            # Data Transfer Objects
│   │   ├── mappers/
│   │   │   └── UserMapper.ts       # Entity ↔ DTO mapping
│   │   └── interfaces/
│   │       └── IServices.ts        # Service interfaces
│   ├── infrastructure/              # Infrastructure layer
│   │   ├── database/
│   │   │   ├── DatabaseConnection.ts
│   │   │   └── models/
│   │   │       └── UserModel.ts    # TypeORM entity
│   │   ├── repositories/
│   │   │   └── UserRepository.ts   # Repository implementation
│   │   ├── services/
│   │   │   ├── JwtService.ts       # JWT token service
│   │   │   └── PasswordService.ts  # Password hashing
│   │   ├── config/
│   │   │   └── Environment.ts      # Configuration
│   │   ├── errors/
│   │   │   └── AppError.ts         # Custom errors
│   │   └── logging/
│   │       └── Logger.ts           # Logging utility
│   ├── presentation/                # Presentation layer (HTTP)
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   │   ├── AuthController.ts
│   │   │   │   └── UserController.ts
│   │   │   ├── routes/
│   │   │   │   ├── authRoutes.ts
│   │   │   │   └── userRoutes.ts
│   │   │   └── middleware/
│   │   │       ├── authMiddleware.ts
│   │   │       ├── errorMiddleware.ts
│   │   │       └── validationMiddleware.ts
│   │   └── server.ts               # Express app setup
│   └── index.ts                     # Application entry point
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── Dockerfile                       # Docker image
├── docker-compose.yml               # Docker services
└── README.md                        # This file
```

## 🔒 Security Features

- Passwords are hashed using bcrypt with configurable salt rounds
- JWT-based authentication with separate access and refresh tokens
- Input validation on all endpoints using class-validator
- Environment-based configuration for sensitive data
- Proper error handling without exposing sensitive information

## 🚦 Scripts

- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run typeorm` - Run TypeORM CLI commands

## 📖 Clean Architecture Layers Explained

### Domain Layer (`src/domain/`)
- Pure business logic with no external dependencies
- Contains entities, value objects, and repository interfaces
- Independent of frameworks, databases, and UI

### Application Layer (`src/application/`)
- Contains use cases (application-specific business rules)
- Orchestrates domain entities to perform actions
- Defines DTOs and interfaces for infrastructure services

### Infrastructure Layer (`src/infrastructure/`)
- Implements interfaces defined by inner layers
- Contains database, external services, and configuration
- Depends on domain and application layers

### Presentation Layer (`src/presentation/`)
- HTTP interface (controllers, routes, middleware)
- Converts HTTP requests to use case calls
- Returns formatted HTTP responses

## 🤝 Contributing

This is a microservice template. Feel free to extend it with:
- Email verification
- Password reset functionality
- Role-based access control (RBAC)
- OAuth2 integration
- Rate limiting
- API documentation with Swagger

## 📄 License

ISC

---

Built with ❤️ using TypeScript and Clean Architecture
