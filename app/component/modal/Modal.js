"use client";

import calendarStore from "@/app/lib/zustore.js";
import { useEffect, useState } from "react";

const dayOfWeeks = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Modal = () => {
  //FormData to store the modal values
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    fromTime: "12:00",
    toTime: "12:00",
    fromAmpm: "AM",
    toAmpm: "AM",
    repeat: "Does not Repeat", // New field for repeat option
  });
  //To validate the modal
  const [errors, setErrors] = useState({});
  const [showRecurrance, setShowRecurrance] = useState("");
  const [recurranceDay, setRecurrancDay] = useState(new Date());

  //Store value changed to close the modal
  const setShow = calendarStore((state) => state.setShowModal);
  // const show = calendarStore((state) => state.showModal);

  const handleCloseModal = () => {
    setShow(false);
    setErrors({});
    setFormData({
      title: "",
      date: "",
      fromTime: "12:00",
      toTime: "12:00",
      fromAmpm: "AM",
      toAmpm: "AM",
      repeat: "Does not Repeat",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Check if the input being changed is the date and update showRecurrance
    if (name === "date") {
      setShowRecurrance(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const { title, fromTime, toTime, fromAmpm, toAmpm, date } = formData;

    if (title.length > 100) {
      errors.title = "Event Title must not exceed 100 characters.";
    }
    if (
      title === "" ||
      date === "" ||
      fromTime === "" ||
      toTime === "" ||
      fromAmpm === "" ||
      toAmpm === ""
    ) {
      errors.title = "All data required";
    }
    const convertTo24Hour = (time, ampm) => {
      let [hours, minutes] = time.split(":").map(Number);
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    };
    const fromTime24 = convertTo24Hour(fromTime, fromAmpm);
    const toTime24 = convertTo24Hour(toTime, toAmpm);
    if (
      fromTime24.hours > toTime24.hours ||
      (fromTime24.hours === toTime24.hours &&
        fromTime24.minutes >= toTime24.minutes)
    ) {
      errors.time = "From Time must be earlier than To Time.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const eventListDates = [];
      const weelyListDates = [];
      const monthlyListDates = [];
      const annualListDates = [];

      const eventFromTime24 =
        parseInt(formData.fromTime.split(":")[0]) +
        (formData.fromAmpm === "PM" &&
        parseInt(formData.fromTime.split(":")[0]) !== 12
          ? 12
          : 0);
      const eventToTime24 =
        parseInt(formData.toTime.split(":")[0]) +
        (formData.toAmpm === "PM" &&
        parseInt(formData.toTime.split(":")[0]) !== 12
          ? 12
          : 0);

      if (formData.repeat === "Does not Repeat") {
        localStorage.setItem("Events", JSON.stringify(formData));
      } else if (formData.repeat === "Daily") {
        // Store daily events for 365 days starting from the given date
        const startDate = new Date(formData.date);
        for (let i = 0; i < 365; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          eventListDates.push({
            date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          });
        }
        const dailyEventsTitleTimes = {
          title: formData.title,
          fromTime: eventFromTime24,
          toTime: eventToTime24,
        };
        localStorage.setItem("DailyEvents", JSON.stringify(eventListDates));
        localStorage.setItem(
          "DailyEventsTitle",
          JSON.stringify(dailyEventsTitleTimes)
        );
      } else if (
        formData.repeat === `Weekly on ${dayOfWeeks[recurranceDay.getDay()]}`
      ) {
        // Start date for the first event
        const startDate = new Date(formData.date);

        // Generate weekly events for the next 52 weeks (1 year)
        for (let i = 0; i < 52; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i * 7); // Increment by 7 days for each week

          weelyListDates.push({
            date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          });
        }
        const weeklyEventsTitleTimes = {
          title: formData.title,
          fromTime: eventFromTime24,
          toTime: eventToTime24,
        };
        localStorage.setItem("WeeklyEvents", JSON.stringify(weelyListDates));
        localStorage.setItem(
          "WeeklyEventsTitle",
          JSON.stringify(weeklyEventsTitleTimes)
        );
      } else if (
        formData.repeat ===
        `Monthly on second ${dayOfWeeks[recurranceDay.getDay()]}`
      ) {
        // Start date for the first event
        const startDate = new Date(formData.date);
        const targetDay = recurranceDay.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)

        // Iterate over each month for the next 12 months
        for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
          const firstDayOfMonth = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + monthOffset,
            1
          );
          let count = 0; // Count occurrences of the target day

          // Iterate through each day of the current month
          for (let day = 1; day <= 31; day++) {
            const currentDate = new Date(
              firstDayOfMonth.getFullYear(),
              firstDayOfMonth.getMonth(),
              day
            );

            // Stop if the date exceeds the current month
            if (currentDate.getMonth() !== firstDayOfMonth.getMonth()) break;

            // Check if the current day matches the target day
            if (currentDate.getDay() === targetDay) {
              count++;
            }

            // Check if this is the second occurrence of the target day
            if (count === 2) {
              monthlyListDates.push({
                date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
              });
              break; // Move to the next month
            }
          }
        }
        const monthlyEventsTitleTimes = {
          title: formData.title,
          fromTime: eventFromTime24,
          toTime: eventToTime24,
        };
        localStorage.setItem("monthlyEvents", JSON.stringify(monthlyListDates));
        localStorage.setItem(
          "monthlyEventsTitle",
          JSON.stringify(monthlyEventsTitleTimes)
        );
      } else if (formData.repeat === "Annually on same day") {
        // Start date for the first event
        const startDate = new Date(formData.date);
        // Generate annual events for the next 10 years
        for (let yearOffset = 0; yearOffset < 10; yearOffset++) {
          const currentDate = new Date(
            startDate.getFullYear() + yearOffset,
            startDate.getMonth(),
            startDate.getDate()
          );
          annualListDates.push({
            date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          });
        }
        const annualEventsTitleTimes = {
          title: formData.title,
          fromTime: eventFromTime24,
          toTime: eventToTime24,
        };
        localStorage.setItem("annualEvents", JSON.stringify(annualListDates));
        localStorage.setItem(
          "annualEventsTitle",
          JSON.stringify(annualEventsTitleTimes)
        );
      }
      handleCloseModal();
    }
  };

  useEffect(() => {
    setRecurrancDay(
      new Date(
        showRecurrance.split("-")[0],
        showRecurrance.split("-")[1] - 1,
        showRecurrance.split("-")[2]
      )
    );
  }, [showRecurrance]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Create Event</h2>
          <form>
            {/* Event Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm mb-2">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="border border-gray-300 p-2 w-full rounded"
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Event Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm mb-2">
                Event Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="border border-gray-300 p-2 w-full rounded"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            {/* From Time and AM/PM */}
            <div className="mb-4">
              <label className="block text-sm mb-2">From Time</label>
              <div className="flex gap-4">
                <input
                  type="time"
                  name="fromTime"
                  className="border border-gray-300 p-2 w-full rounded"
                  value={formData.fromTime}
                  onChange={handleInputChange}
                />
                <select
                  name="fromAmpm"
                  className="border border-gray-300 p-2 rounded"
                  value={formData.fromAmpm}
                  onChange={handleInputChange}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* To Time and AM/PM */}
            <div className="mb-4">
              <label className="block text-sm mb-2">To Time</label>
              <div className="flex gap-4">
                <input
                  type="time"
                  name="toTime"
                  className="border border-gray-300 p-2 w-full rounded"
                  value={formData.toTime}
                  onChange={handleInputChange}
                />
                <select
                  name="toAmpm"
                  className="border border-gray-300 p-2 rounded"
                  value={formData.toAmpm}
                  onChange={handleInputChange}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}

            {/* Repeat Options Dropdown */}
            <div className="mb-4">
              <label htmlFor="repeat" className="block text-sm mb-2">
                Repeat
              </label>
              <select
                id="repeat"
                name="repeat"
                className="border border-gray-300 p-2 w-full rounded max-h-32 overflow-y-auto"
                value={formData.repeat}
                onChange={handleInputChange}
              >
                <option value="Does not Repeat">Does not Repeat</option>
                <option value="Daily">Daily</option>
                <option
                  value={`Weekly on ${dayOfWeeks[recurranceDay.getDay()]}`}
                >
                  {`Weekly on ${dayOfWeeks[recurranceDay.getDay()]}`}
                </option>
                <option
                  value={`Monthly on second ${
                    dayOfWeeks[recurranceDay.getDay()]
                  }`}
                >
                  {`Monthly on second ${dayOfWeeks[recurranceDay.getDay()]}`}
                </option>
                <option value={`Annually on same day`}>
                  {`Annually on same Day`}
                </option>
                <option value="Every day">Every day</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
