import React from "react";
import ReactDOM from "react-dom/client";
import { SignupForm, type SignupData } from "./SignupForm";

const handleDemoSubmit = async (data: SignupData) => {
  console.log("Submitted data:", data);
  // ব্রাউজারে লোডিং স্টেট দেখার জন্য ১ সেকেন্ড অপেক্ষা করানো হলো
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SignupForm onSubmit={handleDemoSubmit} />
  </React.StrictMode>
);