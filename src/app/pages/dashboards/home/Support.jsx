import { useState } from "react";
import { Button, Input } from "components/ui";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "The Willoughby Book",
    email: "sonutest02@gmail.com",
    message: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form); // Replace with API call
    alert("Support request submitted!");
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl 2xl:max-w-5xl">
        <h5 className="dark:text-dark-50 text-lg font-medium text-gray-800">
          Support Request
        </h5>
        <p className="dark:text-dark-200 mt-0.5 text-sm text-gray-500">
          Need Assistance?
        </p>
        <div className="dark:bg-dark-500 my-5 h-px bg-gray-200" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="rounded-xl"
            readOnly
          />
          <Input
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="rounded-xl"
            readOnly
          />
          <div className="flex flex-col gap-1.5">
            <label className="dark:text-dark-100 text-sm font-medium text-gray-800">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="dark:border-dark-300 dark:bg-dark-700 dark:text-dark-50 min-h-[120px] rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
              placeholder="Write your message..."
            />
          </div>

          <Button type="submit" color="primary" className="min-w-[7rem]">
            Submit
          </Button>
        </form>

        {/* Footer links */}
        <div className="mt-8 flex items-center gap-4 text-sm">
          <a
            href="/"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Terms & Conditions
          </a>
          <a
            href="/dashboards/PrivacyPolicy"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
