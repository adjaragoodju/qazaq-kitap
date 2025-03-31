// This is the main entry file for the React application
// It sets up React StrictMode, the router, and authentication provider

import { StrictMode } from 'react'; // Import StrictMode for highlighting potential problems
import { createRoot } from 'react-dom/client'; // Import createRoot API for rendering
import { RouterProvider } from 'react-router-dom'; // Import RouterProvider for routing
import { AuthProvider } from './context/AuthContext'; // Import custom authentication provider
import router from './routes/router'; // Import router configuration
import './index.css'; // Import global styles
import 'inter-ui'; // Import Inter font package

// Create root element and render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the app with AuthProvider to provide authentication context */}
    <AuthProvider>
      {/* Provide the router to enable navigation */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
