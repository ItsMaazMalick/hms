import { getGuestRegistrations } from "@/actions/guest-registration";
import { getStudentRegistrations } from "@/actions/student-registration";
import RegistrationForm from "@/components/forms/registration-form";
import TopContainer from "@/components/header/TopContainer";
import { School } from "lucide-react";

export default async function page() {
  const studentRegistrations = await getStudentRegistrations();
  const guestRegistrations = await getGuestRegistrations();
  return (
    <div className="w-full">
      <TopContainer
        title="Registration"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <RegistrationForm
        studentRegistrations={studentRegistrations}
        guestRegistrations={guestRegistrations}
      />
    </div>
  );
}
