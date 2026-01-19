import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Theme state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Events state
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [customerEmail, setCustomerEmail] = useState(
    localStorage.getItem("customerEmail") || ""
  );

  // Save customer email to localStorage
  useEffect(() => {
    if (customerEmail) {
      localStorage.setItem("customerEmail", customerEmail);
    }
  }, [customerEmail]);

  // Fetch all events
  const fetchEvents = async (category = "All") => {
    setIsLoading(true);
    try {
      const params = category !== "All" ? `?category=${category}` : "";
      const { data } = await axios.get(`/api/events${params}`);
      if (data.success) {
        setEvents(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single event
  const fetchEventById = async (id) => {
    try {
      const { data } = await axios.get(`/api/events/${id}`);
      if (data.success) {
        return data.data;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error("Failed to fetch event details");
      return null;
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/events/categories");
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  // Book tickets
  const bookTickets = async (eventId, customerName, email, seatsBooked) => {
    try {
      const { data } = await axios.post("/api/bookings", {
        eventId,
        customerName,
        customerEmail: email,
        seatsBooked,
      });

      if (data.success) {
        setCustomerEmail(email);
        toast.success("Booking confirmed!");
        return data.data;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Booking failed";
      toast.error(message);
      return null;
    }
  };

  // Fetch bookings by email
  const fetchBookings = async (email = customerEmail) => {
    if (!email) return;
    try {
      const { data } = await axios.get(`/api/bookings?email=${email}`);
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings");
    }
  };

  // Fetch single booking
  const fetchBookingById = async (id) => {
    try {
      const { data } = await axios.get(`/api/bookings/${id}`);
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch booking");
      return null;
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.patch(`/api/bookings/${bookingId}/cancel`);
      if (data.success) {
        toast.success("Booking cancelled");
        fetchBookings();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
      return false;
    }
  };

  // Seed events (one-time)
  const seedEvents = async () => {
    try {
      const { data } = await axios.post("/api/seed");
      if (data.success) {
        toast.success("Events seeded!");
        fetchEvents();
      }
    } catch (error) {
      console.error("Seed failed");
    }
  };

  // Initial load
  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  // Reload events when category changes
  useEffect(() => {
    fetchEvents(selectedCategory);
  }, [selectedCategory]);

  const value = {
    navigate,
    darkMode,
    toggleTheme,
    events,
    isLoading,
    categories,
    selectedCategory,
    setSelectedCategory,
    fetchEvents,
    fetchEventById,
    bookTickets,
    bookings,
    fetchBookings,
    fetchBookingById,
    cancelBooking,
    customerEmail,
    setCustomerEmail,
    seedEvents,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
