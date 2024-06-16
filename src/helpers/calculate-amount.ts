import { chargesPerDay } from "@/constants/data";
import { start } from "repl";

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const firstDayOfNextMonth = new Date(year, month + 1, 1);
const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
const numberOfDays = lastDayOfMonth.getDate();

export const calculateTotalAmount = (
  startDate: string,
  endDate: string,
  room: any
) => {
  const price = room.price.find((price: any) => price.isAvailable === true);
  const selectedBedPrice = price.currentPrice / room.numberOfBeds;

  const formatStartDate = new Date(startDate);
  const formatEndDate = new Date(endDate);

  const differenceInMs =
    formatEndDate && formatStartDate
      ? formatEndDate.getTime() - formatStartDate.getTime()
      : 0;
  const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
  const totalAmount = Math.round(
    daysDifference * (selectedBedPrice / numberOfDays)
  );
  return totalAmount;
};
