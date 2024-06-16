import { CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function AdminAuthHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
