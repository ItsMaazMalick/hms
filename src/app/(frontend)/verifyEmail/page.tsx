import NewVerification from "@/components/verification/new-verification";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: { token: string; verified: string };
}) {
  const { token } = searchParams;

  return <NewVerification token={token} />;
}
