"use client";

import calendarStore from "@/app/lib/zustore";
import { useEffect, useState } from "react";
import { PiLessThan } from "react-icons/pi";
import { PiGreaterThan } from "react-icons/pi";

const monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const YearCalendar = () => {
  const todayDate = calendarStore((state) => state.resetToToday);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const currentDate = new Date();

  const handlePrevYear = () => {
    setCurrentYear((prev) => prev - 1);
  };
  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  // Helper function to get the number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get the first day of the month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, [todayDate]);

  return (
    <div className="border border-blue-950 bg-slate-50 p-5">
      <div className="flex items-center mb-5">
        <span className="text-3xl text-green-900">{currentYear}</span>
        <div className="flex gap-5 ml-10">
          <button onClick={handlePrevYear}>
            <PiLessThan className="text-2xl font-bold" />
          </button>
          <button onClick={handleNextYear}>
            <PiGreaterThan className="text-2xl font-bold" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
        {monthsOfYear.map((month, monthIndex) => (
          <div key={month} className="border p-3 bg-white">
            <div className="text-center font-semibold mb-2">{month}</div>

            {/* Display the days of the week */}
            <div className="grid grid-cols-7 text-center text-sm mb-1">
              {dayOfWeeks.map((day) => (
                <span key={day} className="font-semibold">
                  {day}
                </span>
              ))}
            </div>

            {/* Display dates in the month */}
            <div className="grid grid-cols-7 text-center">
              {/* Add empty spaces for days before the first day of the month */}
              {Array.from({
                length: getFirstDayOfMonth(currentYear, monthIndex),
              }).map((_, i) => (
                <div key={`empty-${i}`} className="text-transparent">
                  -
                </div>
              ))}
              {Array.from({
                length: getDaysInMonth(currentYear, monthIndex),
              }).map((_, day) => {
                const date = new Date(currentYear, monthIndex, day + 1);
                const isToday =
                  date.getDate() === currentDate.getDate() &&
                  date.getMonth() === currentDate.getMonth() &&
                  date.getFullYear() === currentDate.getFullYear();

                return (
                  <div
                    key={day}
                    className={`py-1 ${
                      isToday ? "text-blue-500 font-bold" : ""
                    }`}
                  >
                    {day + 1}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearCalendar;
