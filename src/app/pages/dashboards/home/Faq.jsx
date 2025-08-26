import { useState } from "react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  // Dummy FAQ data
  const faqData = [
    {
      category: "Account",
      question: "How do I create an account?",
      answer:
        "Click on the 'Sign Up' button and fill in your details to create an account.",
    },
    {
      category: "Account",
      question: "How do I reset my password?",
      answer:
        "Go to the login page and click 'Forgot Password'. Follow the instructions sent to your email.",
    },
    {
      category: "Payments",
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, PayPal, and bank transfers.",
    },
    {
      category: "Shipping",
      question: "How long does shipping take?",
      answer:
        "Standard delivery takes 3-5 business days. Express delivery is available for an additional fee.",
    },
    {
      category: "Returns",
      question: "What is your return policy?",
      answer:
        "You can return items within 30 days of purchase with original receipt.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl 2xl:max-w-5xl">
        <h5 className="dark:text-dark-50 text-lg font-medium text-gray-800">
          Frequently Asked Questions
        </h5>
        <div className="dark:bg-dark-500 my-5 h-px bg-gray-200" />

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="dark:border-dark-300 overflow-hidden rounded-xl border"
            >
              <button
                onClick={() => toggle(index)}
                className="dark:text-dark-100 dark:hover:bg-dark-700 flex w-full items-center justify-between px-4 py-3 text-left font-medium text-gray-800 transition hover:bg-gray-50"
              >
                <span>
                  {item.category} - {item.question}
                </span>
                <svg
                  className={`h-5 w-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="dark:text-dark-200 px-4 pb-3 text-sm text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
