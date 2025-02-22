import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Layout/Home";
import Login from "./Pages/Login";
import AuthProvider from "./Provider/AuthProvider";
import AddTask from "./Pages/AddTask";
import ManageTasks from "./Pages/ManageTasks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaskBoard from "./Pages/TaskBoard";
import PrivateRoute from "./PrivateRoute";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    children: [
      {
        path: "/",
        element: <TaskBoard></TaskBoard>,
      },
      {
        path: "/add-task",
        element: (
          <PrivateRoute>
            <AddTask></AddTask>
          </PrivateRoute>
        ),
      },
      {
        path: "/manage-tasks",
        element: (
          <PrivateRoute>
            <ManageTasks></ManageTasks>,
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
