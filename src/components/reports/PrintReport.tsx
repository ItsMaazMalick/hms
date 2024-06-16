"use client";
import Link from "next/link";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";

const currentDate = new Date();
const lastDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
);
const currentYear = currentDate.getFullYear();
const currentMonth =
  currentDate.getMonth() + 1 < 10
    ? `0${currentDate.getMonth() + 1}`
    : currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();
const numberOfDays = lastDayOfMonth.getDate();

const array = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

export function PrintReport({ booking }: any) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function isInCurrentMonth(startDate: string, endDate: string) {
    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
    const dates = [];

    if (startYear === Number(currentYear) || endYear === Number(currentYear)) {
      const isStartMonthCurrent = startMonth === Number(currentMonth);
      const isEndMonthCurrent = endMonth === Number(currentMonth);

      if (isStartMonthCurrent && isEndMonthCurrent) {
        for (let i = startDay; i < endDay; i++) {
          dates.push(i);
        }
      } else if (isStartMonthCurrent) {
        for (let i = startDay; i <= numberOfDays; i++) {
          dates.push(i);
        }
      } else if (isEndMonthCurrent) {
        for (let i = 1; i < endDay; i++) {
          dates.push(i);
        }
      } else if (
        startMonth < Number(currentMonth) &&
        endMonth > Number(currentMonth)
      ) {
        for (let i = 1; i <= numberOfDays; i++) {
          dates.push(i);
        }
      }
    }

    return dates;
  }

  return (
    <>
      {/* PDF SAMPLE */}
      <div className="hidden">
        <div
          ref={componentRef}
          className="w-[1120px] min-h-[790px] flex flex-col items-center"
        >
          <div className="mt-4 text-3xl font-bold">{booking.name}</div>
          <div className="mb-4">
            For the Month of {currentMonth}-{currentYear}
          </div>
          {booking.floors.map((floor: any) => (
            <div key={floor.id}>
              <h3 className="text-center font-semibold">{floor.name}</h3>
              {floor.rooms.map((room: any) => (
                <div key={room.id}>
                  <div
                    key={room.id}
                    className="w-full flex justify-center text-[12px] mt-2"
                  >
                    <p className="border border-black flex justify-center items-center px-1 w-[90px] font-semibold">
                      Room : {room.name}
                    </p>
                    {array.map((arr) => (
                      <p
                        key={arr}
                        className="w-[25px] border border-black flex justify-center items-center"
                      >
                        {arr}
                      </p>
                    ))}
                    <p className="border border-black flex justify-center items-center w-[90px]">
                      Days Occupied
                    </p>
                    <p className="border border-black flex justify-center items-center w-[70px]">
                      Total Days
                    </p>
                    <p className="border border-black flex justify-center items-center w-[75px]">
                      Vacant Days
                    </p>
                  </div>
                  {room.bed.map((bed: any, arr: number) => (
                    <div
                      key={arr}
                      className="w-full flex justify-center text-[12px]"
                    >
                      <p className="border border-black flex justify-center items-center px-1 w-[90px]">
                        {bed.name}
                      </p>
                      {array.map((day) => (
                        <p
                          key={day}
                          className={`w-[25px] border border-black ${
                            bed.bedAssign.some(
                              (assign: {
                                startDate: string;
                                endDate: string;
                              }) =>
                                isInCurrentMonth(
                                  assign.startDate,
                                  assign.endDate
                                ).includes(day)
                            )
                              ? "bg-destructive"
                              : ""
                          } flex justify-center items-center`}
                        />
                      ))}
                      <p className="border border-black flex justify-center items-center w-[90px]">
                        {bed.bedAssign.reduce(
                          (
                            totalDays: number,
                            assign: {
                              startDate: string;
                              endDate: string;
                            }
                          ) => {
                            const daysInMonth = isInCurrentMonth(
                              assign.startDate,
                              assign.endDate
                            ).length;
                            return totalDays + daysInMonth;
                          },
                          0
                        )}
                      </p>
                      <p className="border border-black flex justify-center items-center w-[70px]">
                        {numberOfDays}
                      </p>
                      <p className="border border-black flex justify-center items-center w-[75px]">
                        {numberOfDays -
                          bed.bedAssign.reduce(
                            (
                              totalDays: number,
                              assign: {
                                startDate: string;
                                endDate: string;
                              }
                            ) => {
                              const daysInMonth = isInCurrentMonth(
                                assign.startDate,
                                assign.endDate
                              ).length;
                              return totalDays + daysInMonth;
                            },
                            0
                          )}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="my-4 w-full flex justify-center items-center">
        <Button onClick={handlePrint}>Print Report of {booking.name}</Button>
      </div>
    </>
  );
}
