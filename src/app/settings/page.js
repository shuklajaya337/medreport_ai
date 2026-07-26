"use client";

import { useState } from "react";

export default function Settings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    language: "english",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaved(false);
      return;
    }

    setErrors({});
    setSaved(true);
    console.log("Settings saved:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-white dark:bg-black">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md flex flex-col gap-5"
      >
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Settings
        </h1>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full p-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700"
            }`}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full p-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700"
            }`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300"
          >
            Preferred Language
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>

        {saved && (
          <p role="status" className="text-green-600 dark:text-green-400 text-sm">
            ✓ Settings saved successfully
          </p>
        )}
      </form>
    </div>
  );
}