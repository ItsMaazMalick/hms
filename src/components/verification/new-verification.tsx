"use client";
import { verifyEmail } from "@/actions/new-verification";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FormError } from "../forms/FormError";
import { FormSuccess } from "../forms/FormSuccess";
import { Button } from "../ui/button";
export default function NewVerification({ token }: { token: string }) {
  const [error, setError] = useState<string | undefined>(
    token ? "" : "Token does not exist!"
  );
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const result = await verifyEmail(token);
    setError(result?.error);
    setSuccess(result?.success);
    setLoading(false);
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {!error && !success && (
        <Button disabled={loading} onClick={onSubmit}>
          {loading ? <Loader2 className="animate-spin" /> : "Verify Email"}
        </Button>
      )}
      <div className="w-fit">
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
      </div>
    </div>
  );
}
