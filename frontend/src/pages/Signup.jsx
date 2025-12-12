import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");  
  const email = useField("email");
  const password = useField("password");

  const { signup, isLoading } = useSignup("/api/users/signup");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = await signup({
      email: email.value,
      password: password.value,
      name: name.value,
    });

    if (result.success) {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      setErrorMessage(result.error || "Failed to signup");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <button disabled={isLoading}>{isLoading ? "Signing up..." : "Sign up"}</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Signup;
