import React from "react";
import { Outlet,Link } from "react-router-dom";
import "./authLayout.css";
import { Toaster } from "react-hot-toast";
import NavigationBar from "../../navigationPages/navigationBar";

function AuthLayout() {
    return (
        <div className="layout-container">
            <Toaster />
            <NavigationBar />
            <div className="auth-pages-container">

                <main>
                    <Outlet />
                </main>
               <footer className="site-footer">
  <div className="footer-left">
    &copy; {new Date().getFullYear()} TUT ReportHub. All rights reserved.
  </div>
  <div className="footer-links">
    <Link to="/terms">Terms</Link>
    <Link to="/privacy">Privacy</Link>
    <Link to="/contact-us">Contact</Link>
  </div>
</footer>

            </div>
        </div>
    );
}

export default AuthLayout;