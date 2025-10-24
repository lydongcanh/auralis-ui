# Auralis UI - API Management Interface

A clean, modern React TypeScript interface for managing your FastAPI backend with projects, data rooms, and users.

## Features

### 🚀 Project Management
- **Create Projects**: Simple form to create new projects with name and description
- **View Project Details**: Detailed view showing project information, linked data rooms, and assigned users
- **Link/Unlink Data Rooms**: Easily manage data room associations
- **Add/Remove Users**: Assign users to projects with specific roles (admin, editor, viewer)

### 📁 Data Room Management
- **Create Data Rooms**: Support for both original and Ansarada sources
- **Search Data Rooms**: Find specific data rooms by ID
- **Ansarada Integration**: Fetch data rooms from Ansarada using access tokens

### 👥 User Management
- **Create Users**: Add new users with auth provider IDs
- **Search Users**: Find users by ID and view their details
- **View User Projects**: See all projects accessible to a specific user with their roles

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router DOM** for routing
- **TailwindCSS** for styling
- **shadcn/ui** for beautiful components
- **Lucide React** for icons

### API Integration
- **React Query (@tanstack/react-query)** for data fetching and caching
- **Axios** for HTTP requests
- **Zod** for schema validation
- **React Hook Form** for form handling

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- Consistent error handling and loading states
- Proper TypeScript imports (`type` imports)

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Make sure your backend is running at:**
   ```
   http://127.0.0.1:8000
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

## API Endpoints Used

The interface connects to these FastAPI endpoints:

### Projects
- `POST /projects` - Create new project
- `GET /projects/{project_id}` - Get project by ID
- `POST /projects/{project_id}/data-rooms/{data_room_id}` - Link data room
- `DELETE /projects/{project_id}/data-rooms/{data_room_id}` - Unlink data room
- `POST /projects/{project_id}/users/{user_id}` - Add user to project
- `DELETE /projects/{project_id}/users/{user_id}` - Remove user from project

### Data Rooms
- `POST /data-rooms` - Create new data room
- `GET /data-rooms/{data_room_id}` - Get data room by ID
- `GET /ansarada/data-rooms` - Get Ansarada data rooms

### Users
- `POST /users` - Create new user
- `GET /users/{user_id}` - Get user by ID
- `GET /users/{user_id}/projects` - Get user's accessible projects

## Component Architecture

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── ProjectView.tsx  # Detailed project view
│   ├── ProjectForm.tsx  # Project creation form
│   ├── DataRoomForm.tsx # Data room creation form
│   ├── UserForm.tsx     # User creation form
│   └── *List.tsx        # Search and display components
├── hooks/
│   └── api.ts           # React Query hooks
├── lib/
│   ├── api.ts           # API client
│   ├── schemas.ts       # Zod validation schemas
│   └── utils.ts         # Utility functions
└── types/
    └── api.ts           # TypeScript type definitions
```

## Best Practices Implemented

- **Type Safety**: Full TypeScript coverage with proper type imports
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Loading indicators for all async operations
- **Form Validation**: Client-side validation with Zod schemas
- **Responsive Design**: Mobile-friendly interface
- **Consistent UX**: shadcn/ui for consistent design system
- **Performance**: React Query for efficient data fetching and caching
- **Clean Code**: Modular component structure and separation of concerns

## Development

The interface automatically handles:
- API response caching and invalidation
- Form validation and error display
- Loading states and error boundaries
- Responsive layout and accessibility
- TypeScript type checking

All forms include proper validation, error handling, and success feedback. The interface provides real-time feedback for all API operations.