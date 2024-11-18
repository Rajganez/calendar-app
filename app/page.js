"use client";

import React, { Suspense, useEffect } from "react";
import Navbar from "./component/navbar/Navbar";
import calendarStore from "./lib/zustore";

const MonthCalendar = React.lazy(() =>
  import("./component/calendar/MonthCalendar")
);
const YearCalendar = React.lazy(() =>
  import("./component/calendar/YearCalendar")
);
const WeekCalendar = React.lazy(() =>
  import("./component/calendar/WeekCalendar")
);
const DayCalendar = React.lazy(() =>
  import("./component/calendar/DayCalendar")
);

export default function Home() {
  const getView = calendarStore((state) => state.calendarView);

  const renderContent = () => {
    switch (getView) {
      case "month":
        return <MonthCalendar />;
      case "week":
        return <WeekCalendar />;
      case "day":
        return <DayCalendar />;
      case "year":
        return <YearCalendar />;
      default:
        return <MonthCalendar />;
    }
  };

  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        }
      >
        {renderContent()}
      </Suspense>
    </>
  );
}
