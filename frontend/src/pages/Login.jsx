import useField from "../hooks/useField";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");
  const { auth, error, isLoading } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await auth("/api/users/login", {
      email: email.value,
      password: password.value,
    });

    if (result.success) {
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <button disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
