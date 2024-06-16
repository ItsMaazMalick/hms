import { useState } from "react";

export default function TimerFunction({ time, setTime }: any) {
  setTimeout(() => {
    if (time > 0) {
      setTime(time - 1);
    }
  }, 1000);
  return <div>{time}</div>;
}
