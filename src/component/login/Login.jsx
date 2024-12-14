import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import styles from "./Login.module.css";

function Login() {
  const dispatch = useDispatch();


  const navigate =useNavigate();
 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle input changes and clear errors for specific fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error for the current field
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    console.log(formData);

    setLoading(true);
    setApiError(""); // Clear previous API error

    try {
      const response = await axios.post("http://localhost:8080/auth/login", formData);
     
      
      if (response.status === 200) {
        const { token, user } = response.data;
        console.log(user);
        
        localStorage.setItem("token",token)

        console.log(localStorage.getItem("token")+"this the token")
                                           
        dispatch(login({ user}));

        navigate("/admin/overview");

      }
    } catch (error) {
      setApiError(error.response?.data|| "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/auth/google", { token: idToken });

      if (response.status === 200) {
        console.log("its working ");
        
        const { token, user } = response.data;
        
        localStorage.setItem("token",token)
        console.log(localStorage.getItem("token")+"this the token")
        dispatch(login({ user }));
        navigate("/admin/overview");
      }
    } catch (error) {
      setApiError(error.response?.data || "Google Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Login</h2>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>

        {apiError && <div className={styles.apiError}>{apiError}</div>}

        <div className={styles.forgotPassword}>
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className={styles.googleAuth}>
          {loading ? (
            <div className={styles.loadingSpinner}>Loading...</div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setApiError("Google Login failed. Please try again.")}
              buttonText="Login with Google"
            />
          )}
        </div>

  
      </form>
    </div>
  );
}

export default Login;
