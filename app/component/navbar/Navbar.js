"use client";

import { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import calendarStore from "@/app/lib/zustore.js";
import Modal from "../modal/Modal.js";

const Navbar = () => {
  const [formData, setFormData] = useState("month");
  const setView = calendarStore((state) => state.setCalendarView);
  const todayDate = calendarStore((state) => state.setDateToToday);
  const setShow = calendarStore((state) => state.setShowModal);
  const show = calendarStore((state) => state.showModal);

  useEffect(() => {
    setView(formData);
  }, [formData, setView]);

  const handleToday = () => {
    todayDate(new Date());
  };

  return (
    <>
      <div className="flex flex-row h-20 items-center justify-evenly border border-indigo-950">
        <div className="">
          <button
            className="flex flex-row items-center border border-slate-800 
          hover:bg-slate-200 rounded-full p-2 px-5"
            onClick={() => setShow(true)}
          >
            <IoAddOutline className="md:text-xl" />{" "}
            <span className="font-sans md:ml-1">Create</span>
          </button>
        </div>
        <div className="">
          <button
            className="border border-slate-800 
          hover:bg-slate-200 rounded-full p-2 px-5"
            onClick={handleToday}
          >
            <span className="font-sans">Today</span>
          </button>
        </div>
        <div>
          <form>
            <select
              className="border border-blue-800 px-3 p-2 rounded-full"
              onChange={(e) => setFormData(e.target.value)}
            >
              <option value="month">Month</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="year">Year</option>
            </select>
          </form>
        </div>
      </div>

      {/* Modal */}
      {show && <Modal />}
    </>
  );
};

export default Navbar;
