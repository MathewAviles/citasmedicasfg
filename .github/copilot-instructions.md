# AI Assistant Instructions for FG.MEDIC Codebase

## Project Overview
FG.MEDIC is a medical appointment scheduling system with a Flask backend and Next.js frontend. The system allows patients to schedule appointments with doctors and manages appointment data through Google Calendar integration.

## Architecture

### Backend (`/backend`)
- Flask application with SQLAlchemy ORM
- JWT-based authentication
- Google Calendar API integration for appointment synchronization
- Key models:
  - `User`: Handles both patients and doctors (distinguished by `role` field)
  - `Appointment`: Manages medical appointments with patient-doctor relationships

### Frontend (`/frontend`)
- Next.js application with TypeScript
- Shadcn UI components for consistent design
- Context-based auth state management (`components/auth-context.tsx`)
- Protected routing based on user roles

## Key Integration Points

### Authentication Flow
- JWT tokens stored in localStorage (`fg_medic_token`, `fg_medic_user`)
- Auth state managed through `AuthContext` provider
- Role-based redirects after login:
  ```typescript
  if (user.role === 'doctor') {
    router.push("/dashboard/doctor")
  } else {
    router.push("/agendar_cita")
  }
  ```

### API Communication
- Backend API base URL: `http://127.0.0.1:5000` (dev) or environment variable
- CORS configured for specific origins:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `https://fgmedic.netlify.app`

## Development Workflow

### Backend Setup
1. Create Python virtual environment
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Configure environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET_KEY`
   - Google Calendar credentials in `google-credentials.json`
4. Run migrations: `flask db upgrade`
5. Start server: `flask run`

### Frontend Setup
1. Install dependencies: `pnpm install`
2. Configure environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
   ```
3. Start development server: `pnpm dev`

## Project Conventions

### Component Organization
- UI components in `components/ui/`
- Layout components in root `components/`
- Page components in `app/` directory
- Hooks in `hooks/` directory

### Authentication Patterns
- Protected routes check `isAuthenticated` from `useAuth()`
- API requests should include JWT token in Authorization header
- Handle token expiration by redirecting to login

### Error Handling
- Backend errors return structured JSON with `message` and optional `error` fields
- Frontend uses toast notifications for user feedback (`useToast` hook)
- Authentication errors should trigger logout and redirect

## Common Tasks

### Adding New API Endpoints
1. Add route in `backend/app.py`
2. Update CORS if needed
3. Add JWT protection if required (`@jwt_required()`)
4. Handle in frontend through appropriate service/component

### Database Schema Changes
1. Create migration: `flask db migrate -m "description"`
2. Review migration file in `migrations/versions/`
3. Apply: `flask db upgrade`
4. Update corresponding frontend types/interfaces