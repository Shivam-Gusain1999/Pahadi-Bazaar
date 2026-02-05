import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext"; // Assuming axios is from context

const Contact = () => {
  const { axios } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/contact", { name, email, message });

      if (data.success) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 my-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">Contact Us</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border border-gray-200 dark:border-gray-600 p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition resize-none"
          />
        </div>
        <button
          type="submit"
          className={`mt-2 py-3 px-6 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition shadow-lg hover:shadow-primary/30 ${loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
