import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, role }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();
  const { encodedUserId } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const loginTime = localStorage.getItem("loginTime");

      if (!token || !loginTime) {
        setIsAuthorized(false);
        toast.error("Please log in to access this page.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Check if token has expired (24 hours)
      const timeElapsed = Date.now() - parseInt(loginTime);
      const hoursElapsed = timeElapsed / (1000 * 60 * 60);
      if (hoursElapsed > 24) {
        setIsAuthorized(false);
        localStorage.removeItem("token");
        localStorage.removeItem("encodedUserId");
        localStorage.removeItem("loginTime");
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/auth/verify-token", { token });
        const { role: userRole } = response.data;

        if (userRole !== role) {
          setIsAuthorized(false);
          toast.error("Unauthorized access.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthorized(false);
        toast.error("Invalid or expired token. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    verifyToken();
  }, [navigate, role]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    navigate("/");
    return null;
  }

  return children;
};

export default ProtectedRoute;