export const convertUTCtoPST = (utcTimestamp: Date) => {
  const dateInUTC = new Date(utcTimestamp);
  // Convert UTC date to local date in the desired format
  const formattedDate = dateInUTC.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  return formattedDate;
};
