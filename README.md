# Training Management API

A RESTful API for managing users, exercises, workout sessions, and workout items. Includes authentication, role-based access, and full CRUD operations.

---

## Project Overview

This API allows users to track workouts and exercises, while managers can maintain the exercise catalog.  
- Users can create, update, view, and delete their workout sessions and add exercises.  
- Managers can create, update, and delete exercises.  
- JWT authentication secures endpoints and enforces role-based authorization.

## Features
- User CRUD: Manage users.
- Exercise CRUD (Manager Only): Maintain exercise list.
- Workout Sessions CRUD: Track personal workouts.
- Workout Items CRUD: Add exercises to sessions, including sets, reps, and weight.
- Authentication & Authorization: JWT-secured endpoints with role restrictions.
- Error Handling: JSON-formatted responses with HTTP status codes.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Manager - get all users, User - access deny

### Exercises
- `GET	/api/exercises` - Get all the exercises available
- `GET	/api/exercises/:id` - Get exercise by ID
- `POST /api/exercises` - Create a new exercise (only manager) you need name, muscleGroup, equipment, description
- `PUT /api/exercises` - Update an exercise (only manager) you need name, muscleGroup, equipment, description
- `DELETE /api/exercises` - Delete an exercise

### Workout Sessions

- `GET /api/workouts` - Get all sessions
- `GET /api/workouts/:id` - Get sessions by ID
- `POST /api/workouts` - Create a new session
- `PUT /api/workouts`- Update a session
- `DELETE /api/workouts`- Delete a session

### Workout Items

- `POST	/api/workouts/:sessionId/items` - Add a new exercise to your workout session, you need exerciseID, sets, reps, weight, notes
- `PUT	/api/workouts/items/:id	`- Update a workout Item
- `DELETE	/api/workouts/items/:id`- Delete a workout Item


## Error Handling
Returns meaningful HTTP status codes:

400 – Bad request / validation error

401 – Unauthorized / missing or invalid token

403 – Forbidden / manager access required

404 – Resource not found

500 – Internal server error
