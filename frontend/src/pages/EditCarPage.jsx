import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useField from "../hooks/useField"; // Import the custom hook

const EditCarPage = () => {
  const [car, setCar] = useState(null); // Full car data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  // Use useField for 'make' field
  const make = useField("text");

  // Keep other fields with useState for now
  const [model, setModel] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [renter, setRenter] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;
  const navigate = useNavigate();

  // Update car API call
  const updateCar = async (car) => {
    try {
      const res = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(car),
      });
      if (!res.ok) throw new Error("Failed to update car");
      return true;
    } catch (error) {
      console.error("Error updating car:", error);
      return false;
    }
  };

  // Fetch car data on mount
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setCar(data);

        // Initialize form fields
        make.onChange({ target: { value: data.make } }); // set initial value for useField
        setModel(data.model);
        setIsAvailable(data.availability.isAvailable);
        setRenter(data.availability.renter);
      } catch (err) {
        console.error("Failed to fetch car:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const updatedCar = {
      id,
      make: make.value,
      model,
      availability: {
        isAvailable,
        renter,
      },
    };

    const success = await updateCar(updatedCar);
    if (success) {
      navigate(`/cars/${id}`);
    } else {
      console.error("Failed to update the car");
    }
  };

  const handleAvailabilityChange = (e) => {
    setIsAvailable(e.target.value === "Yes");
  };

  return (
    <div className="create">
      <h2>Update Car</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
          <label>Car Make:</label>
          <input
            required
            {...make} // Use the spread operator from useField
          />

          <label>Car Model:</label>
          <input
            type="text"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <label>Availability:</label>
          <select
            value={isAvailable ? "Yes" : "No"}
            onChange={handleAvailabilityChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label>Renter:</label>
          <input
            type="text"
            value={renter}
            onChange={(e) => setRenter(e.target.value)}
          />

          <button>Update Car</button>
        </form>
      )}
    </div>
  );
};

export default EditCarPage;
