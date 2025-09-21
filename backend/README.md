# Medi-Hub Backend API

A comprehensive healthcare management system backend built with Node.js, Express.js, and MongoDB Atlas.

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, Data Sanitization
- **Validation**: Joi
- **Password Hashing**: bcryptjs

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validation.js        # Request validation schemas
│   ├── models/
│   │   ├── User.js              # User authentication model
│   │   ├── Doctor.js            # Doctor profile model
│   │   ├── Patient.js           # Patient profile model
│   │   ├── Appointment.js       # Appointment scheduling model
│   │   ├── MedicalRecord.js     # Medical records model
│   │   └── Prescription.js      # Prescription management model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User management routes
│   │   ├── doctors.js           # Doctor management routes
│   │   ├── patients.js          # Patient management routes
│   │   ├── appointments.js      # Appointment routes
│   │   ├── medicalRecords.js    # Medical records routes
│   │   ├── prescriptions.js     # Prescription routes
│   │   ├── analytics.js         # Analytics routes
│   │   └── admin.js             # Admin management routes
│   └── app.js                   # Express app configuration
├── server.js                    # Server entry point
├── package.json                 # Dependencies and scripts
└── .env.example                 # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Medi-Hub/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medihub
   JWT_SECRET=your-super-secure-jwt-secret-key
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:5000/health
   ```

## 📋 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/logout` | User logout | Private |
| POST | `/auth/forgot-password` | Send password reset email | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| POST | `/auth/change-password` | Change password | Private |
| GET | `/auth/me` | Get current user profile | Private |
| PUT | `/auth/profile` | Update user profile | Private |

### Doctor Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/doctors` | Get all doctors with search/filters | Public |
| GET | `/doctors/:id` | Get doctor details | Public |
| POST | `/doctors/profile` | Create/update doctor profile | Doctor |
| GET | `/doctors/me/profile` | Get current doctor profile | Doctor |
| PUT | `/doctors/me/availability` | Update availability | Doctor |
| GET | `/doctors/me/appointments` | Get doctor's appointments | Doctor |
| GET | `/doctors/me/patients` | Get doctor's patients | Doctor |
| GET | `/doctors/:id/availability` | Get doctor availability for booking | Public |

### Patient Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/patients/profile` | Create/update patient profile | Patient |
| GET | `/patients/me/profile` | Get current patient profile | Patient |
| PUT | `/patients/me/vitals` | Update patient vitals | Patient |
| GET | `/patients/:id` | Get patient details | Doctor/Admin |

### Appointment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/appointments` | Create appointment | Patient |
| GET | `/appointments` | Get appointments (filtered by role) | Private |
| PUT | `/appointments/:id` | Update appointment | Private |

### User Roles
- **Patient**: Can book appointments, manage profile, view medical records
- **Doctor**: Can manage availability, view patients, create medical records
- **Admin**: Full system access, user management
- **Staff**: Limited administrative access

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Account lockout after failed login attempts
- Password strength requirements
- Rate limiting on authentication endpoints

### Data Protection
- Input validation and sanitization
- NoSQL injection prevention
- XSS protection
- HTTP parameter pollution prevention
- Security headers with Helmet.js

### Password Security
- bcrypt hashing with configurable salt rounds
- Password change requires current password verification
- Password reset via secure tokens

## 🗃️ Database Models

### User Model
- Basic user information and authentication
- Role-based access control
- Account security features (lockout, password reset)
- Email verification system

### Doctor Model
- Professional information (specialization, license)
- Availability scheduling
- Patient management
- Ratings and reviews
- Qualification and experience tracking

### Patient Model
- Medical history and chronic conditions
- Insurance information
- Emergency contacts
- Vitals tracking
- Allergy and medication management

### Appointment Model
- Scheduling with conflict detection
- Status management (scheduled, confirmed, completed, etc.)
- Consultation notes and diagnoses
- Integration with doctor availability

### Medical Record Model
- Comprehensive consultation documentation
- Diagnosis tracking with ICD codes
- Treatment plans and follow-up instructions
- Lab and imaging results
- Access control and sharing permissions

### Prescription Model
- Medication management with dosage tracking
- Refill authorization and tracking
- Drug interaction checking
- Dispensing history
- Digital prescription signatures

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | development |
| `PORT` | Server port | No | 5000 |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 7d |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | No | 12 |

### Rate Limiting
- Global: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Customizable per endpoint

## 🧪 Development

### Scripts
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Check for security vulnerabilities
npm audit
```

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Async/await pattern for asynchronous operations
- Error-first callback pattern where applicable

## 📊 Monitoring & Logging

### Health Check
```bash
GET /health
```
Returns server status, environment, and timestamp.

### Error Handling
- Global error handler with detailed error responses
- Development vs production error formatting
- Automatic error logging
- Graceful handling of MongoDB errors

### Request Logging
- Request/response logging in development mode
- Performance monitoring
- User activity tracking

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT secret
- [ ] Set up MongoDB Atlas production cluster
- [ ] Configure CORS for production domains
- [ ] Enable SSL/TLS
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Support (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs for debugging

## 🔮 Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] File upload system for medical documents
- [ ] Integration with external pharmacy APIs
- [ ] Telemedicine video calling features
- [ ] Advanced analytics and reporting
- [ ] Mobile app API optimizations
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch