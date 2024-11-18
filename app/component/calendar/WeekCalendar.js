"use client";

import calendarStore from "@/app/lib/zustore";
import { useEffect, useState } from "react";
import { PiLessThan } from "react-icons/pi";
import { PiGreaterThan } from "react-icons/pi";

const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
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

const WeekCalendar = () => {
  const todayDate = calendarStore((state) => state.resetToToday);

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState(null);

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  // Function to get the start of the current week (Sunday)
  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  // Get the dates for the current week
  const startOfWeek = getStartOfWeek(currentWeek);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  // Generate hour labels for 12 AM to 12 PM
  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return `${hour} ${i < 12 ? "AM" : "PM"}`;
  });

  useEffect(() => {
    setCurrentWeek(new Date());
  }, [todayDate]);

  useEffect(() => {
    // Load events from localStorage when the component mounts
    const storedEvents = localStorage.getItem("Events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  return (
    <div className="border border-blue-950 bg-slate-50 p-5">
      <div className="ml-2 flex flex-row">
        <div>
          <span className="md:text-3xl text-2xl text-green-900">
            {months[currentWeek.getMonth()]}
          </span>
          <span className="md:text-3xl text-2xl text-green-900">
            {" - "}
            {currentWeek.getFullYear()}
          </span>
        </div>
        <div className="flex flex-row items-center ml-10 gap-5">
          <button onClick={handlePrevWeek}>
            <PiLessThan className="text-xl font-bold" />
          </button>
          <button onClick={handleNextWeek}>
            <PiGreaterThan className="text-xl font-bold" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-black mt-5">
          <thead>
            <tr>
              <th className="text-sm font-light p-3">Week</th>
              {dayOfWeeks.map((days) => (
                <th key={days} className="text-sm font-light p-3">
                  {days}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm font-light p-3 text-center">GMT+0530</td>
              {weekDates.map((date, index) => (
                <td key={index} className="text-center p-3">
                  <span
                    className={`${
                      date.toDateString() === new Date().toDateString()
                        ? "text-blue-500 font-bold"
                        : ""
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </td>
              ))}
            </tr>
            {hourLabels.map((hour, hourIndex) => {
              const currentHour24 = hourIndex; // 0 to 23 representing 24-hour time format

              return (
                <tr
                  key={hourIndex}
                  className="border border-slate-200 text-center"
                >
                  <td className="border border-slate-200 p-2">{hour}</td>
                  {weekDates.map((date, dayIndex) => {
                    // Check if the event matches the current day
                    const isEventDay =
                      events &&
                      date.getDate() === parseInt(events.date.split("-")[2]) &&
                      date.getMonth() ===
                        parseInt(events.date.split("-")[1]) - 1 &&
                      date.getFullYear() ===
                        parseInt(events.date.split("-")[0]);

                    // Convert event times to 24-hour format
                    const eventFromTime24 = events
                      ? parseInt(events.fromTime.split(":")[0]) +
                        (events.fromAmpm === "PM" &&
                        parseInt(events.fromTime.split(":")[0]) !== 12
                          ? 12
                          : 0)
                      : null;
                    const eventToTime24 = events
                      ? parseInt(events.toTime.split(":")[0]) +
                        (events.toAmpm === "PM" &&
                        parseInt(events.toTime.split(":")[0]) !== 12
                          ? 12
                          : 0)
                      : null;
                    // Check if the current hour falls within the event time range
                    const displayEventTitle =
                      isEventDay &&
                      eventFromTime24 <= currentHour24 &&
                      currentHour24 <= eventToTime24;
                    return (
                      <td
                        key={dayIndex}
                        className="border border-slate-200 p-2"
                      >
                        {displayEventTitle ? events.title : ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeekCalendar;
