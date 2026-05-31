# EduFlow - Advanced Education Workflow Automation

A backend system for educational institutions, automating workflows for student records, course management, and notifications.

## Tech Stack

- **Java 17** + **Spring Boot 3.2**
- **Spring Security** + **JWT** authentication
- **Spring Data JPA** + **PostgreSQL**
- **Spring Async** for notifications
- **Docker** + **Docker Compose**
- **Maven** build system

## Features

- ✅ JWT Authentication & Role-Based Access (ADMIN, FACULTY, STAFF)
- ✅ Student CRUD (Create, Read, Update, Delete)
- ✅ Course CRUD + Enrollment/Unenrollment
- ✅ Async Notification System (Email/SMS ready)
- ✅ Global Exception Handling with standard error responses
- ✅ Bean Validation on all inputs
- ✅ Dockerized for easy deployment

## Project Structure

```
src/main/java/com/eduflow/
├── EduFlowApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── StudentController.java
│   ├── CourseController.java
│   └── NotificationController.java
├── dto/
│   ├── AuthDto.java
│   ├── StudentDto.java
│   └── CourseDto.java
├── entity/
│   ├── User.java
│   ├── Student.java
│   ├── Course.java
│   └── Notification.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── ResourceAlreadyExistsException.java
├── repository/
│   ├── UserRepository.java
│   ├── StudentRepository.java
│   ├── CourseRepository.java
│   └── NotificationRepository.java
├── security/
│   ├── JwtUtil.java
│   └── JwtAuthFilter.java
└── service/
    ├── UserService.java
    ├── StudentService.java
    ├── CourseService.java
    ├── NotificationService.java
    └── CustomUserDetailsService.java
```

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/eduflow.git
cd eduflow

# Run with Docker Compose
docker-compose up --build
```

API will be available at `http://localhost:8080`

### Option 2: Local Setup

**Prerequisites:** Java 17, Maven, PostgreSQL

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE eduflow;"

# Configure application.properties or set env vars:
export DB_URL=jdbc:postgresql://localhost:5432/eduflow
export DB_USERNAME=postgres
export DB_PASSWORD=yourpassword
export JWT_SECRET=your_secret_key

# Build & run
mvn clean install
mvn spring-boot:run
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, get JWT token | No |

### Students
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/students` | List all students | ALL |
| GET | `/api/students/{id}` | Get student by ID | ALL |
| POST | `/api/students` | Create student | ADMIN, FACULTY |
| PUT | `/api/students/{id}` | Update student | ADMIN, FACULTY |
| DELETE | `/api/students/{id}` | Delete student | ADMIN |

### Courses
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/courses` | List all courses | ALL |
| GET | `/api/courses/{id}` | Get course by ID | ALL |
| POST | `/api/courses` | Create course | ADMIN, FACULTY |
| PUT | `/api/courses/{id}` | Update course | ADMIN, FACULTY |
| DELETE | `/api/courses/{id}` | Delete course | ADMIN |
| POST | `/api/courses/{courseId}/enroll/{studentId}` | Enroll student | ADMIN, FACULTY |
| DELETE | `/api/courses/{courseId}/unenroll/{studentId}` | Unenroll student | ADMIN, FACULTY |

### Notifications
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/notifications/send` | Send notification | ADMIN, FACULTY |
| GET | `/api/notifications` | All notifications | ADMIN |
| GET | `/api/notifications/recipient/{id}` | By recipient | ADMIN, FACULTY |

## Sample API Usage

### 1. Register Admin
```json
POST /api/auth/register
{
  "username": "admin",
  "password": "admin123",
  "email": "admin@school.com",
  "role": "ADMIN"
}
```

### 2. Login
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
// Response: { "token": "eyJhb...", "username": "admin", "role": "ADMIN" }
```

### 3. Use Token in Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### 4. Create Student
```json
POST /api/students
Authorization: Bearer <token>
{
  "name": "Rahul Sharma",
  "email": "rahul@school.com",
  "enrollmentDate": "2024-01-15"
}
```

## Deployment on Railway.app

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add PostgreSQL plugin
4. Set environment variables:
   - `DB_URL` → from Railway PostgreSQL
   - `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET` → any long random string
5. Deploy!

## License
MIT
