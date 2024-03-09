import React from "react";
import "./App.css";
import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import SignUp from "./components/signup/SignUp";
import Login from "./components/login/Login";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Profile from "./components/profile/Pofile";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/",
        element: <Navigate to="/dashboard" />
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },
    {
        path: "/profile/:id",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
    }
]);

