"use client";

import calendarStore from "@/app/lib/zustore";
import { useEffect, useState } from "react";
import { PiLessThan, PiGreaterThan } from "react-icons/pi";

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

const MonthCalendar = () => {
  // State variables to manage date and events
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateInMonths, setDateInMonths] = useState([]);
  const [events, setEvents] = useState(null);
  const [dailyEvents, setDailyEvents] = useState(null);
  const [dailyEventsTitle, setDailyEventsTitle] = useState(null);
  const [weeklyEvents, setWeeklyEvents] = useState(null);
  const [weeklyEventTitle, setWeeklyEventTitle] = useState(null);
  const [monthlyEvents, setMonthlyEvents] = useState(null);
  const [monthlyEventTitle, setMonthlyEventTitle] = useState(null);
  const [annualEvents, setAnnualEvents] = useState(null);
  const [annualEventTitle, setAnnualEventTitle] = useState(null);

  // Reset to today's date when triggered from calendarStore
  const todayDate = calendarStore((state) => state.resetToToday);

  // Function to generate days of the month, including padding for days of the week
  const dayInMonth = () => {
    const daysArr = [];
    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const lastDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    );

    // Padding with null for days before the 1st of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      daysArr.push(null);
    }

    // Adding days of the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArr.push(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i)
      );
    }

    setDateInMonths(daysArr);
  };

  // Function to navigate to the previous month
  const handlePrevMonth = () => {
    let prevMonth = selectedDate.getMonth() - 1;
    let year = selectedDate.getFullYear();
    if (prevMonth < 0) {
      year--;
      prevMonth = 11; // Wrap to December of the previous year
    }
    setSelectedDate(new Date(year, prevMonth));
  };

  // Function to navigate to the next month
  const handleNextMonth = () => {
    let nextMonth = selectedDate.getMonth() + 1;
    let year = selectedDate.getFullYear();
    if (nextMonth > 11) {
      year++;
      nextMonth = 0; // Wrap to January of the next year
    }
    setSelectedDate(new Date(year, nextMonth));
  };

  // Generate month days when `selectedDate` changes
  useEffect(() => {
    dayInMonth();
  }, [selectedDate]);

  // Update `selectedDate` when `todayDate` is reset
  useEffect(() => {
    setSelectedDate(new Date());
  }, [todayDate]);

  // Load events from local storage when the component mounts
  useEffect(() => {
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
    <>
      {/* Calendar container */}
      <div className="border border-blue-950 bg-slate-50 p-5">
        {/* Header displaying month and year */}
        <div className="ml-2 flex flex-row">
          <div>
            <span className="md:text-3xl text-2xl text-green-900">
              {months[selectedDate.getMonth()]}
            </span>
            <span className="md:text-3xl text-2xl text-green-900">
              {" - "} {selectedDate.getFullYear()}
            </span>
          </div>
          {/* Navigation buttons for month switching */}
          <div className="fixed left-48 md:top-28 md:left-64 flex flex-row items-center ml-10 gap-5">
            <button onClick={handlePrevMonth}>
              <PiLessThan className="text-xl font-bold" />
            </button>
            <button onClick={handleNextMonth}>
              <PiGreaterThan className="text-xl font-bold" />
            </button>
          </div>
        </div>

        {/* Calendar grid with days */}
        <div className="ml-2 mt-5 grid-cols-7 grid h-[70vh]">
          {dayOfWeeks.map((day) => (
            <div
              key={day}
              className="text-center font-semibold border border-slate-100"
            >
              {day}
            </div>
          ))}
          {dateInMonths.map((day, index) => (
            <div
              key={index}
              className={`${
                day && new Date().toDateString() === day.toDateString()
                  ? "text-blue-500 font-bold"
                  : ""
              } text-center border border-slate-200`}
            >
              {/* Display day number */}
              <div>{day ? day.getDate() : ""}</div>

              {/* Display events based on recurrence */}
              <div className="bg-yellow-300 rounded-full text-xs">
                {events &&
                  day &&
                  events.repeat === "Does not Repeat" &&
                  day.toDateString() === new Date(events.date).toDateString() &&
                  events.title}
              </div>
              <div className="bg-green-300 rounded-full text-xs">
                {dailyEvents &&
                  day &&
                  dailyEvents.map(
                    (event) =>
                      new Date(event.date).toDateString() ===
                        day.toDateString() && dailyEventsTitle.title
                  )}
              </div>
              <div className="bg-yellow-300 rounded-full text-xs">
                {weeklyEvents &&
                  day &&
                  weeklyEvents.map(
                    (event) =>
                      new Date(event.date).toDateString() ===
                        day.toDateString() && weeklyEventTitle.title
                  )}
              </div>
              <div className="bg-orange-300 rounded-full text-xs">
                {monthlyEvents &&
                  day &&
                  monthlyEvents.map(
                    (event) =>
                      new Date(event.date).toDateString() ===
                        day.toDateString() && monthlyEventTitle.title
                  )}
              </div>
              <div className="bg-gray-500 rounded-full text-xs">
                {annualEvents &&
                  day &&
                  annualEvents.map(
                    (event) =>
                      new Date(event.date).toDateString() ===
                        day.toDateString() && annualEventTitle.title
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MonthCalendar;
