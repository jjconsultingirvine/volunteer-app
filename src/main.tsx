import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { ClerkProvider } from '@clerk/clerk-react'
import "./index.css";
import clerk_key from "./clerk";
import "./style/global.css";
import App from "./App";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerk_key}>
      <div className="outer_page">
        <App></App>
      </div>
    </ClerkProvider>
  </React.StrictMode>
);