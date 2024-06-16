const currentDate = new Date();

export const checkBookingDate = (
  startDate: string,
  endDate: string
): string => {
  const currentDateWithoutTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // Compare start date with current date
  if (startDateObj > currentDateWithoutTime) {
    return "pending";
  }

  // Compare end date with current date
  if (endDateObj < currentDateWithoutTime) {
    return "expired";
  }

  // If start date is today or end date is today
  if (
    startDateObj <= currentDateWithoutTime &&
    endDateObj >= currentDateWithoutTime
  ) {
    return "ongoing";
  }

  return "";
};
