import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
  "Admin Panel",
  description: "",
};

export default function SignIn() {
  return <LoginForm />;
}
