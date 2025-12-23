# Radio Station CMS Backend (Option 2 - Full Implementation)

This directory contains the scaffold for a full-featured backend API server for the Radio Station CMS.

## Architecture

- **Framework**: Node.js + Express
- **Database**: PostgreSQL (or SQLite for development)
- **Authentication**: JWT-based
- **Image Storage**: Local file system (or S3-compatible)
- **API**: RESTful API with JSON responses

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, environment)
│   ├── controllers/     # Route controllers (presenters, shows, auth)
│   ├── models/          # Database models (Sequelize/TypeORM)
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, validation, error handling
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper functions
│   └── server.ts        # Express app entry point
├── migrations/          # Database migration files
├── uploads/             # Uploaded images (presenters)
├── tests/               # API tests
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## Setup Instructions (When Ready to Implement)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
npm run migrate  # Run database migrations
npm run seed     # Seed initial data
```

### 4. Start Development Server
```bash
npm run dev      # Development mode with hot reload
npm run build    # Production build
npm start        # Production mode
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout

### Presenters
- `GET /api/presenters` - List all presenters (supports ?archived=true)
- `GET /api/presenters/:id` - Get presenter by ID
- `POST /api/presenters` - Create new presenter
- `PUT /api/presenters/:id` - Update presenter
- `DELETE /api/presenters/:id` - Delete presenter
- `PATCH /api/presenters/:id/archive` - Archive presenter
- `PATCH /api/presenters/:id/restore` - Restore archived presenter

### Shows
- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Get show by ID
- `POST /api/shows` - Create new show
- `PUT /api/shows/:id` - Update show
- `DELETE /api/shows/:id` - Delete show
- `PATCH /api/shows/:id/lineup` - Update show lineup/schedule

### Schedules/Lineups
- `GET /api/schedules` - Get all schedules (weekday/weekend)
- `PUT /api/schedules/weekday` - Update weekday lineup
- `PUT /api/schedules/weekend` - Update weekend lineup
- `PUT /api/schedules/friday` - Update Friday lineup

### Media/Uploads
- `POST /api/upload/image` - Upload presenter image
- `DELETE /api/upload/image/:id` - Delete image
- `GET /uploads/:filename` - Serve uploaded images

## Database Schema

### Users
```sql
id: UUID PRIMARY KEY
email: VARCHAR(255) UNIQUE
password_hash: VARCHAR(255)
role: ENUM('ADMIN', 'CONTENT_UPDATER', 'CREATOR')
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Presenters
```sql
id: SERIAL PRIMARY KEY
name: VARCHAR(255) NOT NULL
bio: TEXT
image_url: VARCHAR(500)
image_local_path: VARCHAR(500)
socials: JSONB (twitter, instagram, facebook)
is_archived: BOOLEAN DEFAULT FALSE
archived_at: TIMESTAMP
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Shows
```sql
id: SERIAL PRIMARY KEY
title: VARCHAR(255) NOT NULL
synopsis: TEXT
image_url: VARCHAR(500)
presenter_id: INTEGER REFERENCES presenters(id)
donation_goal: DECIMAL(10,2)
donation_current: DECIMAL(10,2)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Schedules
```sql
id: SERIAL PRIMARY KEY
day_type: ENUM('weekday', 'friday', 'weekend')
show_id: INTEGER REFERENCES shows(id)
start_time: TIME
end_time: TIME
presenter_id: INTEGER REFERENCES presenters(id) (nullable, overrides show.presenter_id)
order: INTEGER
is_active: BOOLEAN DEFAULT TRUE
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

## Security Considerations

- JWT tokens with expiration
- Password hashing with bcrypt (10+ rounds)
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration for mobile app
- File upload size limits (5MB max for images)
- SQL injection prevention (parameterized queries)
- XSS prevention

## Deployment

### Docker
```bash
docker-compose up -d
```

### Manual
- Deploy to VPS (DigitalOcean, AWS EC2, etc.)
- Use PM2 for process management
- Nginx as reverse proxy
- SSL certificate with Let's Encrypt

## Future Enhancements

- [ ] GraphQL API option
- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Content versioning system
- [ ] Automated backups
- [ ] CDN integration for images
- [ ] Multi-language support
- [ ] Audit logs for all changes
