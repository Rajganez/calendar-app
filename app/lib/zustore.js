import { create } from "zustand";

const calendarStore = create((set) => ({
  //To change the Recurring Pattern for the userInterface
  calendarView: "month",
  setCalendarView: (newView) => set({ calendarView: newView }),
  //To return the calendar back to the today date
  resetToToday: "",
  setDateToToday: (newDate) => set({ resetToToday: newDate }),
  //To show the modal for the create event
  showModal: false,
  setShowModal: (newModal) => set({ showModal: newModal }),
}));

export default calendarStore;
