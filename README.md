#  E-Commerce Project

A modern, scalable, and full-featured e-commerce application built with Clean Architecture principles, using .NET 9.0 backend and Angular 17 frontend technologies.

##  Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

##  Features

###  User Features
- ✅ Product listing and detail viewing
- ✅ Product search and filtering
- ✅ Shopping cart management (add, remove, update)
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Social media login (Facebook, Google)
- ✅ Order creation and tracking
- ✅ Real-time product updates (SignalR)

###  Admin Features
- ✅ Admin panel
- ✅ Product management (CRUD operations)
- ✅ Customer management
- ✅ Order management
- ✅ File upload and management
- ✅ Dashboard and statistics

###  Technical Features
- ✅ Clean Architecture pattern
- ✅ CQRS pattern (MediatR)
- ✅ Repository Pattern
- ✅ Unit of Work Pattern
- ✅ Data validation with FluentValidation
- ✅ Logging with Serilog
- ✅ Real-time communication with SignalR
- ✅ State management with NgRx
- ✅ Responsive design

##  Technologies

### Backend
- **.NET 9.0** - Framework
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core** - ORM
- **PostgreSQL** - Database
- **SignalR** - Real-time communication
- **JWT Bearer** - Authentication
- **MediatR** - CQRS implementation
- **FluentValidation** - Data validation
- **Serilog** - Logging
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Angular 17** - Framework
- **TypeScript** - Programming language
- **NgRx** - State management
- **Angular Material** - UI components
- **Bootstrap 5** - CSS framework
- **RxJS** - Reactive programming
- **SignalR Client** - Real-time communication
- **Toastr** - Notifications

## 📁 Project Structure

```
E-Ticaret/
│
├── ETicaretAPI/                    # Backend Project
│   ├── Core/                       # Domain and Application layers
│   │   ├── ETicaretAPI.Domain/     # Domain entities, events, value objects
│   │   └── ETicaretAPI.Application/# Application logic, CQRS handlers
│   │
│   ├── Infrastructure/             # Infrastructure layer
│   │   ├── ETicaretAPI.Persistence/# EF Core, DbContext, Repositories
│   │   ├── ETicaretAPI.Infrastructure/# Services, Storage, Token
│   │   └── ETicaretAPI.SignalR/   # SignalR hubs and services
│   │
│   └── Presentation/               # Presentation layer
│       └── ETicaretAPI.API/       # Controllers, Middleware, Startup
│
└── ETicaretClient/                 # Frontend Project
    ├── src/
    │   ├── app/
    │   │   ├── admin/              # Admin panel modules
    │   │   ├── ui/                 # User interface modules
    │   │   ├── services/           # API services
    │   │   ├── store/              # NgRx store and effects
    │   │   └── guards/             # Route guards
    │   └── assets/                # Static files
    └── angular.json
```

##  Installation

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/download/) (version 14 or higher)
- [Git](https://git-scm.com/downloads)

### Step 1: Clone the Repository

```bash
git clone https://github.com/username/e-commerce.git
cd e-commerce
```

### Step 2: Database Setup

1. Start PostgreSQL and create a database:

```sql
CREATE DATABASE ETicaretDb;
```

2. Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "PostgreSQL": "User ID=postgres;Password=YOUR_PASSWORD;Host=localhost;Port=5432;Database=ETicaretDb;"
  }
}
```

### Step 3: Backend Setup

1. Navigate to the backend folder:

```bash
cd ETicaretAPI/Infrastructure/ETicaretAPI.Persistence
```

2. Apply Entity Framework Core migrations:

```bash
dotnet ef database update --startup-project "../../Presentation/ETicaretAPI.API"
```

If the `dotnet ef` tool is not installed:

```bash
dotnet tool install --global dotnet-ef
```

3. Run the API:

```bash
cd ../../Presentation/ETicaretAPI.API
dotnet restore
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7136`
- HTTP: `http://localhost:5113`
- Swagger UI: `https://localhost:7136/swagger`

### Step 4: Frontend Setup

1. Open a new terminal and navigate to the frontend folder:

```bash
cd ETicaretClient
```

2. Install dependencies:

```bash
npm install
```

3. Run the frontend:

```bash
npm start
```

or

```bash
ng serve
```

The frontend will be available at:
- `http://localhost:4200`

## 📖 Usage

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Refresh token

#### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

#### Baskets
- `GET /api/baskets` - Get basket
- `POST /api/baskets` - Add item to basket
- `PUT /api/baskets` - Update basket
- `DELETE /api/baskets/{basketItemId}` - Remove item from basket

#### Users
- `GET /api/users` - List all users (Admin)
- `GET /api/users/{id}` - Get user details

#### Files
- `POST /api/files` - Upload file
- `GET /api/files/{id}` - Download file

### Frontend Usage

1. **Home Page**: Browse and search products
2. **Shopping Cart**: Add products to cart and manage them
3. **Login/Register**: Create an account or sign in
4. **Admin Panel**: Manage products and orders with admin privileges

## 📚 API Documentation

API documentation is available through Swagger UI:

```
https://localhost:7136/swagger
```

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.


