"use client";
import React, { useState } from "react";
import emailjs from "emailjs-com";
import Header from "../../dashboard/_components/Header";
import Footer from "../Footer";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
        name:event.target.name.value,
        email:"VirtueHireX", // User's email (recipient)
        from_name:  event.target.email.value, // Your name or brand
        message: event.target.message.value, // Message from form
        subject: event.target.subject.value, // Subject from form
    };

    try {
      // Send email via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICEID, // Replace with your EmailJS service ID
        process.env.NEXT_PUBLIC_TEMPLATE_ID, // Replace with your EmailJS template ID
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_KEY // Replace with your EmailJS public key
      );
      console.log("Email sent successfully!");
      setFormSubmitted(true);
      event.target.reset(); // Reset form fields
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-black text-white">
        <section className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center">
            Contact Us
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center sm:text-xl">
            Got a technical issue? Want to send feedback about a beta feature?
            Need details about our Business plan? Let us know.
          </p>
          {formSubmitted ? (
            <p className="text-center text-green-500 font-bold">
              Thank you! Your message has been sent.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-8 bg-gray-800 p-6 shadow-md rounded-lg"
            >
                 <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Your Name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  className="block w-full p-2.5 text-black rounded-lg"
                  placeholder="Vaibhav Bhosale"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full p-2.5 text-black rounded-lg"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="block w-full p-2.5 text-black rounded-lg"
                  placeholder="Let us know how we can help you"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className="block w-full p-2.5 text-black rounded-lg"
                  placeholder="Leave a comment..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;
