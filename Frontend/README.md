# Task Management Frontend

A React TypeScript frontend application for the HMCTS Task Management System. This application provides a user-friendly interface for creating and managing tasks.

## Overview

This frontend application is built with React 19 and TypeScript, providing a modern, type-safe user interface for task management. It communicates with a FastAPI backend to create and manage tasks.

## Features

- **Task Creation Form** - Create new tasks with the following fields:
  - Title (required)
  - Description (optional)
  - Status (pending, in_progress, completed)
  - Deadline (date and time picker)
  
- **Calendar Date Picker** - Interactive calendar popup for selecting dates:
  - Month/year navigation
  - Today button for quick selection
  - Visual indication of selected date and today's date
  - Click outside to close

- **Time Picker** - Interactive time selection popup:
  - Scrollable hour (0-23) and minute (0-59) lists
  - "Now" button to select current time
  - Visual indication of selected time
  - Confirm button to apply selection

- **Modal Pop-up Display** - After successfully creating a task, a modal pop-up displays all task details including:
  - Task ID
  - Title and description
  - Status with color-coded badges
  - Deadline (with date and time)
  - Creation timestamp (with date and time)

- **UK Government Design System** - Styled according to UK Government design standards:
  - Official color palette
  - Government-standard typography
  - Accessibility-compliant focus states
  - Consistent spacing and layout

- **Modern UI/UX**:
  - Fixed black header strip with logo
  - Responsive design
  - Smooth animations and transitions
  - Color-coded status indicators
  - Form validation

- **Error Handling** - User-friendly error messages for API failures

## Technologies

- **React 19** - UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API requests
- **CSS3** - Styling with modern CSS features

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- Backend server running on `http://localhost:8000` (see Backend README for setup)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Running the Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
Frontend/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── assets/          # Static assets
│       └── logo.png    # Application logo
├── public/              # Public static files
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`.

### Endpoint Used

**Create Task**
- **Method:** `POST`
- **URL:** `http://localhost:8000/`
- **Status Code:** `201 Created`
- **Request Body:**
  ```typescript
  {
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
    deadline: string; // ISO datetime string (YYYY-MM-DDTHH:mm:ss)
  }
  ```
- **Response:** Returns the created task with ID and `created_at` timestamp
  ```typescript
  {
    id: string;
    title: string;
    description?: string;
    status: string;
    deadline: string; // ISO datetime string
    created_at: string; // ISO datetime string
  }
  ```

### Configuration

To change the API URL, update the axios request in `src/App.tsx`:

```typescript
const response = await axios.post<TaskResponse>('http://localhost:8000/', form);
```

## Component Structure

### App Component

The main application component (`App.tsx`) manages:
- Form state for task creation
- Separate state for date and time inputs
- Calendar and time picker visibility states
- Modal visibility state
- Created task data
- Form submission and API communication

### Key Features

1. **Form State Management** - Uses React `useState` to manage form inputs
2. **Date and Time Handling** - Separates date and time inputs, combines them into ISO datetime format
3. **Calendar Component** - Custom calendar picker with month navigation and date selection
4. **Time Picker Component** - Custom time picker with hour and minute selection
5. **Click-Outside Detection** - Closes calendar and time picker when clicking outside
6. **Modal Display** - Conditionally renders a modal pop-up after successful task creation
7. **Error Handling** - Displays alerts for API errors
8. **Form Reset** - Automatically resets form after successful submission

## Styling

The application uses CSS following UK Government Design System standards:
- **UK Government Color Palette** - Official government colors (blues, greys, yellow for focus)
- **Typography** - Arial font family with government-standard sizes and line heights
- **Form Elements** - Square borders, 2px borders, yellow focus rings for accessibility
- **Buttons** - Government primary button style with proper hover and focus states
- **Modal Components** - Government-style modals with proper borders and spacing
- **Status Badges** - Color-coded badges matching government design standards
- **Responsive Design** - Mobile-friendly breakpoints at 640px
- **Animations** - Smooth fade-in and slide-up animations for modals
- **Custom Scrollbars** - Styled scrollbars for time picker lists

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The production build will be in the `dist/` directory

3. Preview the production build:
   ```bash
   npm run preview
   ```

## Troubleshooting

### CORS Errors

If you encounter CORS errors:
- Ensure the backend server is running
- Verify the API URL in `src/App.tsx` matches your backend URL
- Check that the backend has CORS middleware configured

### Port Already in Use

If port 5173 is already in use:
- Vite will automatically use the next available port
- Or specify a custom port: `npm run dev -- --port 3000`

### TypeScript Errors

If you see TypeScript errors:
- Run `npm install` to ensure all dependencies are installed
- Check that `tsconfig.json` is properly configured
- Verify Node.js version meets requirements

### Build Errors

If the build fails:
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are compatible

## Development Tips

- The development server supports Hot Module Replacement (HMR) for instant updates
- Use React DevTools browser extension for debugging
- Check the browser console for API errors and warnings
- TypeScript provides type checking during development

## License

This project was created as part of an application to HMCTS (Her Majesty's Courts and Tribunals Service).
