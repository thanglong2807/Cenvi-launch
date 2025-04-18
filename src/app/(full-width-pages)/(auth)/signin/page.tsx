import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào nền tảng quản lý Cenvi Launch",
};

export default function SignIn() {
  return <SignInForm />;
}
