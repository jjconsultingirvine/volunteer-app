import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ClerkProvider } from '@clerk/clerk-react'
import "./index.css";
import Home from "./pages/home";
import OrgPage from "./pages/org_page";
import clerk_key from "./clerk";
import Profile from "./pages/profile";
import Onboard from "./pages/onboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/home",
    element: <Home></Home>
  },
  {
    path: "/org/:org_id",
    element: <OrgPage></OrgPage>
  },
  {
    path: "/profile/:profile_id",
    element: <Profile></Profile>
  },
  {
    path: "/onboard",
    element: <Onboard></Onboard>
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerk_key}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);