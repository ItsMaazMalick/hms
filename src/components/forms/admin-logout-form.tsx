import { cookies } from "next/headers";
import FormSubmitButton from "../button/FormSubmitButton";
import { redirect } from "next/navigation";

export default function AdminLogoutForm() {
  const handleLogout = async () => {
    "use server";
    cookies()?.set("auth-token", "", { expires: new Date(0) });
    redirect("/auth/login");
  };
  return (
    <form action={handleLogout}>
      <FormSubmitButton variant={"destructive"} title="Sign Out" />
    </form>
  );
}
