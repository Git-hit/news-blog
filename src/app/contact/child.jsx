"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import NewsFooter from "../../components/Footer/Footer";

export default function Child() {
  const [news, setNews] = useState([]);
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, menuRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`),
        ]);

        const [newsData, menuData] = await Promise.all([
          newsRes.json(),
          menuRes.json(),
        ]);

        setNews(newsData);
        setMenu(menuData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setNews([]);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "US",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | error | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, formData);
      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        country: "US",
        phone: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar posts={news} menu={menu} />
      <main className="py-14">
        <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
          <div className="max-w-lg mx-auto space-y-3 sm:text-center">
            <h3 className="text-indigo-600 font-semibold">Contact</h3>
            <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
              Get in touch
            </p>
            <p>We’d love to hear from you! Please fill out the form below.</p>
          </div>

          <div className="mt-12 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} method="post" action={"#"} className="space-y-5">
              <div className="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                <div>
                  <label className="font-medium">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium">
                  Phone number{" "}
                  <span className="text-gray-400 text-sm">(optional)</span>
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="text-sm bg-transparent outline-none rounded-lg h-full"
                    >
                      <option value="US">US</option>
                      <option value="IN">IN</option>
                      <option value="UK">UK</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-000"
                    className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium">Message</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              {status === "success" && (
                <p className="text-green-600 text-sm">
                  Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-sm">
                  Something went wrong. Try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
      <NewsFooter />
    </>
  );
}