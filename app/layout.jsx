import "@styles/globals.css";
import { Children } from "react";
import { Metadata } from "next";

import Nav from "@components/Nav.jsx";
import Provider from "@components/Provider.jsx";

export const metadata = {
  tittle: "promptoper",
  description: "Discover the best prompts around the web & share AI prompts",
  icons: "/assets/images/logo.svg",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <title>Prompter</title>
      <body>
        <Provider>
          <div className="main">
            <div className="gradient"></div>
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
