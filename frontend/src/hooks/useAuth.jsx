import { useState } from "react";

export default function useAuth() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Auth function to handle login or signup
   * @param {string} url - API endpoint for login or signup
   * @param {object} payload - Data to send (e.g., { email, password, name? })
   * @returns {object} - { success: boolean, user?: object, error?: string }
   */
  const auth = async (url, payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return { success: false, error: data.error || "Something went wrong" };
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

  return { auth, isLoading, error };
}
