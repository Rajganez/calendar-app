"use client";

import calendarStore from "@/app/lib/zustore";
import { useEffect, useState } from "react";
import { PiLessThan } from "react-icons/pi";
import { PiGreaterThan } from "react-icons/pi";

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
const dayOfWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DayCalendar = () => {
  const todayDate = calendarStore((state) => state.resetToToday);

  const [currentDay, setCurrentDay] = useState(new Date());
  const [events, setEvents] = useState(null);
  const [dailyEvents, setDailyEvents] = useState(null);
  const [dailyEventsTitle, setDailyEventsTitle] = useState(null);
  const [weeklyEvents, setWeeklyEvents] = useState(null);
  const [weeklyEventTitle, setWeeklyEventTitle] = useState(null);
  const [monthlyEvents, setMonthlyEvents] = useState(null);
  const [monthlyEventTitle, setMonthlyEventTitle] = useState(null);
  const [annualEvents, setAnnualEvents] = useState(null);
  const [annualEventTitle, setAnnualEventTitle] = useState(null);

  const handlePrevDay = () => {
    setCurrentDay((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDay((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return `${hour} ${i < 12 ? "AM" : "PM"}`;
  });

  useEffect(() => {
    setCurrentDay(new Date());
  }, [todayDate]);

  useEffect(() => {
    // Load events from localStorage when the component mounts
    const storedEvents = localStorage.getItem("Events");
    const storedDailyEvents = localStorage.getItem("DailyEvents");
    const storedDailyEventsTitle = localStorage.getItem("DailyEventsTitle");
    const storedWeeklyEvents = localStorage.getItem("WeeklyEvents");
    const storedWeeklyEventTitle = localStorage.getItem("WeeklyEventsTitle");
    const storedMonthlyEvents = localStorage.getItem("monthlyEvents");
    const storedMonthlyEventTitle = localStorage.getItem("monthlyEventsTitle");
    const storedAnnualEvents = localStorage.getItem("annualEvents");
    const storedAnnualEventTitle = localStorage.getItem("annualEventsTitle");

    if (storedEvents) setEvents(JSON.parse(storedEvents));
    if (storedDailyEvents) setDailyEvents(JSON.parse(storedDailyEvents));
    if (storedDailyEventsTitle)
      setDailyEventsTitle(JSON.parse(storedDailyEventsTitle));
    if (storedWeeklyEvents) setWeeklyEvents(JSON.parse(storedWeeklyEvents));
    if (storedWeeklyEventTitle)
      setWeeklyEventTitle(JSON.parse(storedWeeklyEventTitle));
    if (storedMonthlyEvents) setMonthlyEvents(JSON.parse(storedMonthlyEvents));
    if (storedMonthlyEventTitle)
      setMonthlyEventTitle(JSON.parse(storedMonthlyEventTitle));
    if (storedAnnualEvents) setAnnualEvents(JSON.parse(storedAnnualEvents));
    if (storedAnnualEventTitle)
      setAnnualEventTitle(JSON.parse(storedAnnualEventTitle));
  }, []);

  return (
    <div className="border border-blue-950 bg-slate-50 p-5">
      <div className="ml-2 flex flex-row justify-start">
        <div>
          <span className="md:text-3xl text-2xl text-green-900">
            {months[currentDay.getMonth()]}
          </span>
          <span className="md:text-3xl text-2xl text-green-900">
            {" - "}
            {currentDay.getFullYear()}
          </span>
        </div>
        <div className="flex flex-row items-center ml-10 gap-5">
          <button onClick={handlePrevDay}>
            <PiLessThan className="text-xl font-bold" />
          </button>
          <button onClick={handleNextDay}>
            <PiGreaterThan className="text-xl font-bold" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto">
        <table className="border-collapse  mt-5">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr>
              <th className="text-sm font-light p-3 text-left">Day/GMT+0530</th>
              <th className="text-sm font-light p-3 text-left">
                <div className="flex flex-col font-semibold">
                  <span>{dayOfWeeks[currentDay.getDay()]}</span>
                  <span>{currentDay.getDate()}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {hourLabels.map((hour, hourIndex) => {
              // Convert the current hour label to 24-hour format for comparison
              const currentHour24 = hourIndex; // 0 to 23 represents the 24-hour time format

              //Funtion to convert to 24-hour format for "Does not repeat"
              const timeDateTo24Hour = (fromTime, fromAmPm, toTime, toAmPm) => {
                const eventFromTime24 = events
                  ? parseInt(fromTime.split(":")[0]) +
                    (fromAmPm === "PM" &&
                    parseInt(fromTime.split(":")[0]) !== 12
                      ? 12
                      : 0)
                  : null;
                const eventToTime24 = events
                  ? parseInt(toTime.split(":")[0]) +
                    (toAmPm === "PM" && parseInt(toTime.split(":")[0]) !== 12
                      ? 12
                      : 0)
                  : null;
                return {
                  eventFrom: eventFromTime24,
                  eventToTime: eventToTime24,
                };
              };
              //Function to convert to 24-hour format for Other recurrence Events
              const recurrenceEventsTo24Hour = (
                fromTime,
                fromAmPm,
                toTime,
                toAmPm
              ) => {
                const eventFromTime24 =
                  fromTime + (fromAmPm === "PM" && fromTime !== 12 ? 12 : 0);
                const eventToTime24 =
                  toTime + (toAmPm === "PM" && toTime !== 12 ? 12 : 0);
                return {
                  eventFrom: eventFromTime24,
                  eventToTime: eventToTime24,
                };
              };

              // Function called to get the fromTime and toTime
              const eventConvertedTime = events
                ? timeDateTo24Hour(
                    events.fromTime,
                    events.fromAmpm,
                    events.toTime,
                    events.toAmpm
                  )
                : "";
              //To place the event name for the exact date and time
              const isEventDay =
                events &&
                currentDay.getDate() === parseInt(events.date.split("-")[2]) &&
                currentDay.getMonth() ===
                  parseInt(events.date.split("-")[1]) - 1 &&
                currentDay.getFullYear() ===
                  parseInt(events.date.split("-")[0]);

              //Recurrance function called
              const dailyEventConvertedFormat = dailyEventsTitle
                ? recurrenceEventsTo24Hour(
                    dailyEventsTitle.fromTime,
                    dailyEventsTitle.fromAmpm,
                    dailyEventsTitle.toTime,
                    dailyEventsTitle.toAmpm
                  )
                : "";
              const weeklyEventConvertedFormat = weeklyEventTitle
                ? recurrenceEventsTo24Hour(
                    weeklyEventTitle.fromTime,
                    weeklyEventTitle.fromAmpm,
                    weeklyEventTitle.toTime,
                    weeklyEventTitle.toAmpm
                  )
                : "";
              const monthlyEventConvertedFormat = monthlyEventTitle
                ? recurrenceEventsTo24Hour(
                    monthlyEventTitle.fromTime,
                    monthlyEventTitle.fromAmpm,
                    monthlyEventTitle.toTime,
                    monthlyEventTitle.toAmpm
                  )
                : "";
                const annualEventConvertedFormat = annualEventTitle
                ? recurrenceEventsTo24Hour(
                    annualEventTitle.fromTime,
                    annualEventTitle.fromAmpm,
                    annualEventTitle.toTime,
                    annualEventTitle.toAmpm
                  )
                : "";
              //Mapped the daily events date to place the event title
              const isDailyEvent =
                dailyEvents &&
                currentDay.getDate() ===
                  parseInt(
                    dailyEvents.map((dates) => dates.date.split("-")[2])
                  ) &&
                currentDay.getMonth() ===
                  parseInt(
                    dailyEvents.map((dates) => dates.date.split("-")[1])
                  ) -
                    1 &&
                currentDay.getFullYear() ===
                  parseInt(
                    dailyEvents.map((dates) => dates.date.split("-")[0])
                  );
              //Weekly event Mapping for the exact date
              const isWeeklyEvent =
                weeklyEvents &&
                currentDay.getDate() ===
                  parseInt(
                    weeklyEvents.map((dates) => dates.date.split("-")[2])
                  ) &&
                currentDay.getMonth() ===
                  parseInt(
                    weeklyEvents.map((dates) => dates.date.split("-")[1])
                  ) -
                    1 &&
                currentDay.getFullYear() ===
                  parseInt(
                    weeklyEvents.map((dates) => dates.date.split("-")[0])
                  );
              //Monthly event Mapping for the exact date
              const isMonthlyEvent =
                monthlyEvents &&
                currentDay.getDate() ===
                  parseInt(
                    monthlyEvents.map((dates) => dates.date.split("-")[2])
                  ) &&
                currentDay.getMonth() ===
                  parseInt(
                    monthlyEvents.map((dates) => dates.date.split("-")[1])
                  ) -
                    1 &&
                currentDay.getFullYear() ===
                  parseInt(
                    monthlyEvents.map((dates) => dates.date.split("-")[0])
                  );
                //Annual event Mapping for the exact date
              const isAnnualEvent =
              annualEvents &&
              currentDay.getDate() ===
                parseInt(
                  annualEvents.map((dates) => dates.date.split("-")[2])
                ) &&
              currentDay.getMonth() ===
                parseInt(
                  annualEvents.map((dates) => dates.date.split("-")[1])
                ) -
                  1 &&
              currentDay.getFullYear() ===
                parseInt(
                  annualEvents.map((dates) => dates.date.split("-")[0])
                );
              // 8825847921,8438553984
              // Check if the current hour falls within the event time range
              const displayEventTitle =
                isEventDay &&
                eventConvertedTime.eventFrom <= currentHour24 &&
                currentHour24 <= eventConvertedTime.eventToTime;
              //Daily Events check if the current hour falls within the event time
              const displayDailyEvents =
                isDailyEvent &&
                dailyEventConvertedFormat.eventFrom <= currentHour24 &&
                currentHour24 <= dailyEventConvertedFormat.eventToTime;
              //Weekly Events check if the current hour falls within the event time
              const displayWeeklyEvents =
                isWeeklyEvent &&
                weeklyEventConvertedFormat.eventFrom <= currentHour24 &&
                currentHour24 <= weeklyEventConvertedFormat.eventToTime;
              //Monthly Events check if the current hour falls within the event time
              const displayMonthlyEvents =
                isMonthlyEvent &&
                monthlyEventConvertedFormat.eventFrom <= currentHour24 &&
                currentHour24 <= monthlyEventConvertedFormat.eventToTime;
              //Annual Events check if the current hour falls within the event time
              const displayAnnualEvents =
                isAnnualEvent &&
                annualEventConvertedFormat.eventFrom <= currentHour24 &&
                currentHour24 <= annualEventConvertedFormat.eventToTime;

              return (
                <tr key={hourIndex} className="border border-slate-200">
                  <td className="border border-slate-200 p-2">{hour}</td>
                  <td className="border border-slate-200 p-2">
                    {displayEventTitle && events.title}
                    {displayDailyEvents && dailyEventsTitle.title}
                    {displayWeeklyEvents && weeklyEventTitle.title}
                    {displayMonthlyEvents && monthlyEventTitle.title}
                    {displayAnnualEvents && annualEventTitle.title}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DayCalendar;
