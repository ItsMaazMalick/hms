// import { adminRegister } from "@/app/actions/admin/adminAuth";

import AdminRegisterForm from "@/components/forms/admin-register-form";
import AdminAuthHeader from "@/components/header/AdminAuthHeader";
import { Card, CardContent } from "@/components/ui/card";
// import { adminRegisterSchema } from "@/lib/validations/adminValidation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default function AdminRegisterPage() {
  const handleSubmit = async (formData: FormData) => {};
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm z-50">
        <AdminAuthHeader
          title="Register"
          description="Enter details below to register to your account"
        />
        <CardContent>
          <AdminRegisterForm />
          <div className="mt-4 text-center text-sm">
            Already have an account?
            <Link
              className="underline text-blue-600 ml-1 font-bold"
              href="/auth/login"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
