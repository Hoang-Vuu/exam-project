import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle duplicate email or other server errors
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return { success: false, error: data.error };
      }

      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { signup, isLoading, error };
}
