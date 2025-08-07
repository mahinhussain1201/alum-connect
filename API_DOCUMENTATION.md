# Alum-Connect API Documentation

## Overview
Alum-Connect is a platform that connects students with alumni for internships, mentorship, and networking opportunities. This documentation covers all API routes, authentication mechanisms, and third-party services used in the application.

## Base URL
```
http://localhost:8000/api
```

## Authentication
The application uses JWT (JSON Web Tokens) for authentication. Most routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Routes (`/api/auth`)

### 1.1 User Registration
- **Endpoint:** `POST /api/auth/signup`
- **Description:** Register a new user account with role-specific data
- **Request Body:**

#### Student Registration
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "STUDENT",
  "studentData": {
    "fullName": "string (min 2 characters)",
    "cgpa": "number (0-10)",
    "cv": "string (valid URL)",
    "department": "string (min 2 characters)",
    "rollno": "string (required)",
    "domain": "DOMAIN_ENUM"
  }
}
```

#### Alumni Registration
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "ALUMNI",
  "alumniData": {
    "fullName": "string (min 2 characters)",
    "presentCompany": "string (min 2 characters)",
    "yearsOfExperience": "number (non-negative)",
    "domain": "DOMAIN_ENUM"
  }
}
```

- **Response:** `201 Created`
  ```json
  {
    "message": "User created successfully!",
    "token": "jwt_token",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "STUDENT" | "ALUMNI"
    }
  }
  ```

- **Error Responses:**
  - `400 Bad Request`: Validation errors or missing required fields
  - `401 Unauthorized`: User already exists
  - `500 Internal Server Error`: Server-side errors

### 1.2 User Login
- **Endpoint:** `POST /api/auth/signin`
- **Description:** Authenticate existing user
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "message": "Login successful!",
    "token": "jwt_token",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "STUDENT" | "ALUMNI",
      "profile": {
        // Student profile fields or Alumni profile fields based on role
      }
    }
  }
  ```

- **Error Responses:**
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`: Invalid email or password
  - `500 Internal Server Error`: Server-side errors

### 1.3 LinkedIn OAuth
- **Endpoint:** `GET /api/auth/linkedin`
- **Description:** Initiate LinkedIn OAuth flow
- **Response:** Redirects to LinkedIn authorization page
- **Scopes:** `openid`, `profile`, `email`

### 1.4 LinkedIn Callback
- **Endpoint:** `GET /api/auth/linkedin/callback`
- **Description:** Handle LinkedIn OAuth callback
- **Query Parameters:** `code`, `state`
- **Response:** `200 OK`
  ```json
  {
    "message": "LinkedIn sign-in successful.",
    "token": "jwt_token"
  }
  ```

- **Error Responses:**
  - `400 Bad Request`: Missing authorization code
  - `500 Internal Server Error`: OAuth process failure

---

## 1.5 Authentication Implementation Details

### Data Flow
1. **User Registration**: 
   - User submits registration form with role-specific data
   - Backend validates data using Zod schemas
   - Password is hashed using bcrypt (salt rounds: 10)
   - User record is created in database
   - Role-specific profile (Student/Alumni) is created in respective table
   - JWT token is generated and returned

2. **User Login**:
   - User submits email and password
   - Backend finds user by email
   - Password is verified using bcrypt.compare()
   - JWT token is generated and returned with user profile data

3. **LinkedIn OAuth**:
   - User clicks LinkedIn sign-in
   - Backend redirects to LinkedIn authorization URL
   - LinkedIn redirects back with authorization code
   - Backend exchanges code for access token
   - User profile is fetched from LinkedIn API
   - User is created/authenticated and JWT token is returned

### Security Features
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Zod schema validation for all inputs
- **CORS Configuration**: Proper cross-origin setup
- **Environment Variables**: Secure configuration management
- **Database Transactions**: Ensures data consistency

### Validation Rules
- **Username**: Required, minimum 1 character
- **Email**: Required, valid email format, unique
- **Password**: Required, minimum 1 character
- **Role**: Required, must be "STUDENT" or "ALUMNI"
- **Student Data**: Required for students
  - fullName: minimum 2 characters
  - cgpa: number between 0-10
  - cv: valid URL
  - department: minimum 2 characters
  - rollno: required
  - domain: must be valid enum value
- **Alumni Data**: Required for alumni
  - fullName: minimum 2 characters
  - presentCompany: minimum 2 characters
  - yearsOfExperience: non-negative number
  - domain: must be valid enum value

### Error Handling
- **Validation Errors**: Detailed field-specific error messages
- **Network Errors**: User-friendly network error messages
- **Server Errors**: Graceful handling of server-side errors
- **Database Errors**: Proper transaction rollback on failures

### Test Credentials
Use these seeded users for testing:

#### Student
- Email: `student@gmail.com`
- Password: `123456`

#### Alumni
- Email: `alumni@gmail.com`
- Password: `123456`

---

## 2. User Routes (`/api/user`)

### 2.1 Get User Information
- **Endpoint:** `GET /api/user/userInfo`
- **Description:** Get current user's basic information
- **Authentication:** Required
- **Response:** `200 OK`
  ```json
  {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "STUDENT" | "ALUMNI"
  }
  ```

---

## 3. Alumni Routes (`/api/alumni`)

### Profile Management

#### 3.1 Add Basic Profile
- **Endpoint:** `POST /api/alumni/addBasicProfile`
- **Description:** Create alumni basic profile
- **Authentication:** Required (Alumni only)
- **Request Body:**
  ```json
  {
    "fullName": "string",
    "presentCompany": "string",
    "yearsOfExperience": "number",
    "domain": "DOMAIN_ENUM"
  }
  ```

#### 3.2 Update Basic Profile
- **Endpoint:** `PUT /api/alumni/updateBasicProfile`
- **Description:** Update alumni basic profile
- **Authentication:** Required (Alumni with basic profile)

#### 3.3 Get Basic Profile
- **Endpoint:** `GET /api/alumni/getBasicProfile`
- **Description:** Retrieve alumni basic profile
- **Authentication:** Required (Alumni with basic profile)

#### 3.4 Add Experience
- **Endpoint:** `POST /api/alumni/addExperience`
- **Description:** Add work experience
- **Authentication:** Required (Alumni with basic profile)
- **Request Body:**
  ```json
  {
    "company": "string",
    "role": "string",
    "startDate": "date",
    "endDate": "date",
    "description": "string"
  }
  ```

#### 3.5 Get Experience
- **Endpoint:** `GET /api/alumni/getExperience`
- **Description:** Retrieve alumni work experiences
- **Authentication:** Required (Alumni with basic profile)

### Internship Management

#### 3.6 Post Internship
- **Endpoint:** `POST /api/alumni/postInternship`
- **Description:** Create new internship posting
- **Authentication:** Required (Alumni with basic profile)
- **Request Body:**
  ```json
  {
    "company": "string",
    "title": "string",
    "jd": "string",
    "jdType": "TEXT" | "URL",
    "domain": "DOMAIN_ENUM",
    "location": "string",
    "compensation": "string",
    "duration": "string",
    "startTime": "date",
    "endTime": "date",
    "criteria": "string",
    "weeklyHours": "string"
  }
  ```

#### 3.7 Get Posted Internships
- **Endpoint:** `GET /api/alumni/getPostedInternships`
- **Description:** Get all internships posted by alumni
- **Authentication:** Required (Alumni with basic profile)

#### 3.8 Get All Applications
- **Endpoint:** `GET /api/alumni/getAllApplications/:id`
- **Description:** Get all applications for a specific internship
- **Authentication:** Required (Alumni with basic profile)

#### 3.9 Accept Student
- **Endpoint:** `PATCH /api/alumni/acceptStudent/:id`
- **Description:** Accept a student's internship application
- **Authentication:** Required (Alumni with basic profile)

#### 3.10 Reject Student
- **Endpoint:** `PATCH /api/alumni/rejectStudent/:id`
- **Description:** Reject a student's internship application
- **Authentication:** Required (Alumni with basic profile)

#### 3.11 Close Internship
- **Endpoint:** `PATCH /api/alumni/closeInternship/:id`
- **Description:** Close an internship posting
- **Authentication:** Required (Alumni with basic profile)

#### 3.12 Update Internship
- **Endpoint:** `PUT /api/alumni/updateInternship/:id`
- **Description:** Update internship details
- **Authentication:** Required (Alumni with basic profile)

### Mentorship Management

#### 3.13 Get Mentorship Status
- **Endpoint:** `GET /api/alumni/mentorshipStatus`
- **Description:** Check if alumni is a mentor
- **Authentication:** Required (Alumni with basic profile)

#### 3.14 Set Mentor Profile
- **Endpoint:** `POST /api/alumni/setMentorProfile`
- **Description:** Create mentor profile
- **Authentication:** Required (Alumni with basic profile)
- **Request Body:**
  ```json
  {
    "keywords": ["DOMAIN_ENUM"],
    "experience": "number",
    "interaction": "INTERACTION_LEVEL",
    "maxMentees": "number",
    "levelsOfMentees": ["MENTEE_LEVEL"],
    "interests": ["MENTOR_INTEREST"],
    "linkedinProfile": "string",
    "currentOrganization": "string",
    "passingYear": "number"
  }
  ```

#### 3.15 Get Mentor Profile
- **Endpoint:** `POST /api/alumni/getMentorProfile`
- **Description:** Retrieve mentor profile
- **Authentication:** Required (Alumni with basic profile)

#### 3.16 Update Mentor Profile
- **Endpoint:** `PATCH /api/alumni/setMentorProfile`
- **Description:** Update mentor profile
- **Authentication:** Required (Alumni with basic profile)

#### 3.17 Get Mentorships for Mentors
- **Endpoint:** `GET /api/alumni/getMentorshipsForMentors`
- **Description:** Get all mentorship requests for mentor
- **Authentication:** Required (Alumni with basic profile, Mentor)

#### 3.18 Accept Mentorship
- **Endpoint:** `PATCH /api/alumni/acceptMentorship`
- **Description:** Accept a mentorship request
- **Authentication:** Required (Alumni with basic profile, Mentor)

---

## 4. Student Routes (`/api/student`)

### Profile Management

#### 4.1 Add Basic Profile
- **Endpoint:** `POST /api/student/addBasicProfile`
- **Description:** Create student basic profile
- **Authentication:** Required (Student only)
- **Request Body:**
  ```json
  {
    "fullName": "string",
    "cgpa": "number",
    "cv": "string",
    "department": "string",
    "rollno": "string",
    "domain": "DOMAIN_ENUM"
  }
  ```

#### 4.2 Update Basic Profile
- **Endpoint:** `PUT /api/student/updateBasicProfile`
- **Description:** Update student basic profile
- **Authentication:** Required (Student with basic profile)

#### 4.3 Get Basic Profile
- **Endpoint:** `GET /api/student/getBasicProfile`
- **Description:** Retrieve student basic profile
- **Authentication:** Required (Student with basic profile)

#### 4.4 Add Experience
- **Endpoint:** `POST /api/student/addExperience`
- **Description:** Add student experience
- **Authentication:** Required (Student with basic profile)
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "techStacks": ["string"],
    "startDate": "date",
    "endDate": "date"
  }
  ```

#### 4.5 Get Experience
- **Endpoint:** `GET /api/student/getExperience`
- **Description:** Retrieve student experiences
- **Authentication:** Required (Student with basic profile)

### Internship Management

#### 4.6 Get All Internships
- **Endpoint:** `GET /api/student/getAllInternships`
- **Description:** Get all available internships
- **Authentication:** Required (Student)

#### 4.7 Apply for Internship
- **Endpoint:** `POST /api/student/applyInternship/:id`
- **Description:** Apply for a specific internship
- **Authentication:** Required (Student with basic profile)

#### 4.8 Get Applied Internships
- **Endpoint:** `GET /api/student/getAppliedInternships`
- **Description:** Get all internships applied by student
- **Authentication:** Required (Student with basic profile)

#### 4.9 Get Accepted Internships
- **Endpoint:** `POST /api/student/getAcceptedInternships`
- **Description:** Get all accepted internship applications
- **Authentication:** Required (Student with basic profile)

#### 4.10 Get Rejected Internships
- **Endpoint:** `GET /api/student/getRejectedInternships`
- **Description:** Get all rejected internship applications
- **Authentication:** Required (Student with basic profile)

### Mentorship Management

#### 4.11 Get All Mentors
- **Endpoint:** `GET /api/student/getMentors`
- **Description:** Get all available mentors
- **Authentication:** Required (Student)

#### 4.12 Get Mentor Profile
- **Endpoint:** `POST /api/student/getMentorProfile`
- **Description:** Get specific mentor profile
- **Authentication:** Required (Student)

#### 4.13 Connect to Mentor
- **Endpoint:** `POST /api/student/connectMentor`
- **Description:** Send mentorship request to mentor
- **Authentication:** Required (Student)

---

## 5. Internship Routes (`/api/internship`)

### 5.1 Get Internship by ID
- **Endpoint:** `GET /api/internship/getInternship/:id`
- **Description:** Get specific internship details
- **Authentication:** Required
- **Response:** `200 OK`
  ```json
  {
    "id": "number",
    "company": "string",
    "title": "string",
    "jd": "string",
    "jdType": "TEXT" | "URL",
    "domain": "DOMAIN_ENUM",
    "location": "string",
    "compensation": "string",
    "duration": "string",
    "startTime": "date",
    "endTime": "date",
    "criteria": "string",
    "weeklyHours": "string",
    "closed": "boolean",
    "createdAt": "date",
    "postedBy": "object"
  }
  ```

---

## 6. Event Routes (`/api/events`)

### 6.1 Get Upcoming Events
- **Endpoint:** `GET /api/events/getUpcomingEvents`
- **Description:** Get all upcoming events
- **Authentication:** Required
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "date": "date",
      "startTime": "date",
      "endTime": "date",
      "location": "string",
      "mode": "VIRTUAL" | "OFFLINE" | "HYBRID",
      "type": "UPCOMING",
      "attendeesCount": "number",
      "links": ["object"]
    }
  ]
  ```

### 6.2 Get Past Events
- **Endpoint:** `GET /api/events/getPastEvents`
- **Description:** Get all past events
- **Authentication:** Required

### 6.3 Register for Upcoming Event
- **Endpoint:** `POST /api/events/registerForUpcomingEvent`
- **Description:** Register for an upcoming event
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "eventId": "number"
  }
  ```

---

## 7. Data Models

### Enums

#### Role
- `STUDENT`
- `ALUMNI`

#### Domain
- `SOFTWARE`, `FRONTEND`, `BACKEND`, `PRODUCT_MANAGEMENT`, `WEB_DEVELOPMENT`, `MOBILE_DEVELOPMENT`, `MACHINE_LEARNING`, `DATA_SCIENCE`, `BLOCKCHAIN`, `CLOUD_COMPUTING`, `CYBERSECURITY`, `BUSINESS_MANAGEMENT`, `FINANCE`, `ACCOUNTING`, `HUMAN_RESOURCES`, `MARKETING`, `SALES`, `OPERATIONS`, `STRATEGY`, `PROJECT_MANAGEMENT`, `SUPPLY_CHAIN_MANAGEMENT`, `CONSULTING`, `ENTREPRENEURSHIP`, `BUSINESS_DEVELOPMENT`, `BUSINESS_ANALYTICS`, `ECONOMICS`, `PUBLIC_RELATIONS`

#### ApplicationStatus
- `PENDING`
- `ACCEPTED`
- `REJECTED`

#### InteractionLevel
- `VERY_LOW` (0-3 hours per month)
- `MODERATE` (3-8 hours per month)
- `HIGH` (8+ hours per month)

#### MenteeLevel
- `SECOND_YEAR`
- `THIRD_YEAR`
- `FOURTH_YEAR`
- `FIFTH_YEAR`
- `RESEARCH`

#### MentorInterest
- `PRO_BONO_HELP`
- `MENTORING_AND_PARTNERSHIP`
- `INVESTING`
- `HELPING_IN_NETWORKING`
- `FLOATING_OWN_PROJECTS`

#### MentorshipStatus
- `PENDING`
- `ACTIVE`
- `COMPLETED`
- `REJECTED`

#### EventMode
- `VIRTUAL`
- `OFFLINE`
- `HYBRID`

#### EventType
- `UPCOMING`
- `PAST`

#### JobDescriptionType
- `TEXT`
- `URL`

---

## 8. Third-Party Services

### 8.1 Authentication Services

#### LinkedIn OAuth 2.0
- **Service:** LinkedIn API
- **Purpose:** Social login authentication
- **Endpoints Used:**
  - `https://www.linkedin.com/oauth/v2/authorization` - Authorization
  - `https://www.linkedin.com/oauth/v2/accessToken` - Token exchange
  - `https://api.linkedin.com/v2/userinfo` - User profile data
- **Environment Variables Required:**
  - `LINKEDIN_CLIENT_ID`
  - `LINKEDIN_CLIENT_SECRET`
  - `LINKEDIN_REDIRECT_URI`
- **Scopes:** `openid`, `profile`, `email`

### 8.2 Database Services

#### PostgreSQL with Prisma ORM
- **Service:** PostgreSQL Database
- **ORM:** Prisma Client
- **Purpose:** Primary data storage
- **Environment Variable:** `DATABASE_URL`
- **Features:**
  - User management
  - Profile management
  - Internship postings
  - Application tracking
  - Mentorship system
  - Event management

### 8.3 Security Services

#### JWT (JSON Web Tokens)
- **Library:** `jsonwebtoken`
- **Purpose:** Stateless authentication
- **Environment Variable:** `JWT_SECRET`
- **Token Structure:** `{ userId: number }`

#### Password Hashing
- **Library:** `bcrypt`
- **Purpose:** Secure password storage
- **Salt Rounds:** 10

### 8.4 Validation Services

#### Zod Schema Validation
- **Library:** `zod`
- **Purpose:** Request/response validation
- **Features:**
  - Type-safe validation
  - Custom error messages
  - Runtime type checking

### 8.5 HTTP Client

#### Axios
- **Library:** `axios`
- **Purpose:** HTTP requests to external APIs
- **Usage:**
  - LinkedIn OAuth integration
  - External API calls

---

## 9. Socket Services

**Note:** Currently, the application does not implement any WebSocket or real-time communication services. The application relies on traditional HTTP requests for all communication.

## 10. Error Handling
### Error Response Format
```json
{
  "message": "Error description",
  "errors": ["Validation errors array"]
}
```

---

## 11. Middleware

### Authentication Middleware
- **File:** `middleware/auth.js`
- **Purpose:** Verify JWT tokens
- **Usage:** Applied to protected routes

### Role-Based Middleware
- **Alumni Middleware:** `middleware/alumniMiddleware.js`
  - `isAlumni` - Verify user is alumni
  - `isAlumWithBasicProfile` - Verify alumni has basic profile
  - `isMentor` - Verify alumni is a mentor

- **Student Middleware:** `middleware/studentMiddleware.js`
  - `isStudent` - Verify user is student
  - `isStudentWithBasicProfile` - Verify student has basic profile

---

## 12. Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT
JWT_SECRET="your_jwt_secret_key"

# LinkedIn OAuth
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
LINKEDIN_REDIRECT_URI="http://localhost:8000/api/auth/linkedin/callback"
```

---

## 13. Dependencies

### Backend Dependencies
```json
{
  "@prisma/client": "^6.2.1",
  "axios": "^1.8.2",
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "zod": "^3.24.1"
}
```

### Frontend Dependencies
```json
{
  "@fortawesome/fontawesome-free": "^6.7.2",
  "axios": "^1.7.9",
  "font-awesome": "^4.7.0",
  "lucide-react": "^0.476.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.0"
}
```

---

## 14. API Testing

### Using Postman/Insomnia
1. Set base URL: `http://localhost:8000/api`
2. For protected routes, add header: `Authorization: Bearer <token>`
3. Use the endpoints documented above

### Example cURL Commands
```bash
# Student Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student123",
    "email": "student@example.com",
    "password": "password123",
    "role": "STUDENT",
    "studentData": {
      "fullName": "John Doe",
      "cgpa": 3.8,
      "cv": "https://drive.google.com/cv-link",
      "department": "Computer Science",
      "rollno": "CS2025001",
      "domain": "SOFTWARE"
    }
  }'

# Alumni Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alumni123",
    "email": "alumni@example.com",
    "password": "password123",
    "role": "ALUMNI",
    "alumniData": {
      "fullName": "Jane Smith",
      "presentCompany": "Tech Corp",
      "yearsOfExperience": 5,
      "domain": "SOFTWARE"
    }
  }'

# Sign in
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Get user info (with token)
curl -X GET http://localhost:8000/api/user/userInfo \
  -H "Authorization: Bearer <your_token>"
```

---

This documentation covers all the routes, third-party services, and technical details of the Alum-Connect application. The application currently does not use any WebSocket services but relies on traditional HTTP requests for all communication. 