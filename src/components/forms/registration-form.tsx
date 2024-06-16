"use client";

import { useEffect, useState } from "react";
import StudentRegistrationForm from "./student-registration-form";
import TextInput from "../Inputs/TextInput";
import { Input } from "../ui/input";
import GuestRegistrationForm from "./guest-registration-form";
import { Label } from "../ui/label";
import { getStudentRegistrations } from "@/actions/student-registration";

export default function RegistrationForm({
  studentRegistrations,
  guestRegistrations,
}: any) {
  const [role, setRole] = useState("student");

  return (
    <div>
      <div className="text-center bg-destructive rounded-md p-2 mt-4">
        <Label className="mr-2">Select Role</Label>
        <select
          value={role}
          onChange={(e: any) => setRole(e.target.value)}
          className="p-2 w-[200px] rounded-md bg-primary text-primary-foreground"
        >
          <option value="student">Student</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      {role === "student" ? (
        <StudentRegistrationForm studentRegistrations={studentRegistrations} />
      ) : (
        <GuestRegistrationForm guestRegistrations={guestRegistrations} />
      )}
    </div>
  );
}
