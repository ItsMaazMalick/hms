export default function TopCard({
  title,
  icon,
  length,
}: {
  title: string;
  icon: React.ReactNode;
  length: number | undefined;
}) {
  return (
    <div
      className={`w-full bg-gradient-to-r from-[#09203F] to-[#537895] rounded-md shadow-md px-4 py-4 bg-opacity-50 hover:bg-opacity-100 transition-all duration-300 text-primary-foreground`}
    >
      <p className="mb-2">{title}</p>
      <div className="flex items-center justify-between ">
        <p className="font-bold">{icon}</p>
        <p className="font-bold">{length ? length : 0}</p>
      </div>
    </div>
  );
}
