# Project Management System

A modern, responsive React-based project management system with drag-and-drop task boards, built with Tailwind CSS and shadcn/ui components.

## Features

- **Project Management**: Create, view, and manage projects
- **Task Boards**: Drag-and-drop task management with three columns (To-Do, In Progress, Done)
- **Team Collaboration**: Add team members to projects
- **Task Management**: Create tasks with deadlines, assignees, and descriptions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS, shadcn/ui
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.js           # Utility functions
├── App.js                 # Main application component
├── Projects.js            # Projects listing page
├── ProjectDetail.js       # Project details page
├── TaskBoard.js           # Drag-and-drop task board
├── api.js                 # API service functions
├── index.js               # Application entry point
├── index.css              # Global styles
└── package.json           # Dependencies and scripts
```

## API Endpoints

The application expects the following API endpoints:

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/projects/:id/tasks` - Get tasks for a project
- `POST /api/projects/:id/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task details
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Features in Detail

### Project Management
- View all projects in a responsive card layout
- Create new projects with title, description, and team members
- Navigate to project details by clicking on project cards

### Task Management
- Create tasks with title, description, status, deadline, and assignee
- Drag and drop tasks between columns (To-Do, In Progress, Done)
- Visual indicators for overdue tasks
- Real-time task count updates

### User Experience
- Loading states for all async operations
- Error handling with retry options
- Responsive design for all screen sizes
- Smooth animations and transitions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
