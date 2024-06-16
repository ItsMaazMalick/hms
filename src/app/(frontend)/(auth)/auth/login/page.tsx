import AdminLoginForm from "@/components/forms/admin-login-form";
import AdminAuthHeader from "@/components/header/AdminAuthHeader";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm z-50">
        <AdminAuthHeader
          title="Login"
          description="Enter your email below to login to your account"
        />
        <CardContent>
          <AdminLoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <Link
              className="underline text-blue-600 ml-1 font-bold"
              href="/auth/register"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
