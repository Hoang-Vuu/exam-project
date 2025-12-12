import useField from "../hooks/useField";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");
  const email = useField("email");
  const password = useField("password");

  const { auth, isLoading, error } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await auth("/api/users/signup", {
      name: name.value,
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
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <button disabled={isLoading}>{isLoading ? "Signing up..." : "Sign up"}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
