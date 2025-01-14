import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

const CalendarView = ({ tasks, onDateSelect }) => {
  // Function to check if a date has tasks
  const hasTasksOnDate = (date) => {
    return tasks.some(task => {
      const taskDate = new Date(task.date);
      return format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  // Custom tile content
  const getTileContent = ({ date, view }) => {
    if (view === 'month' && hasTasksOnDate(date)) {
      return (
        <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1"></div>
      );
    }
  };

  // Custom tile className
  const getTileClassName = ({ date, view }) => {
    if (view === 'month' && hasTasksOnDate(date)) {
      return 'has-tasks';
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onDateSelect}
        tileContent={getTileContent}
        tileClassName={getTileClassName}
        className="rounded-lg border shadow-sm"
      />
      <style jsx>{`
        .calendar-container {
          margin-bottom: 1.5rem;
        }
        :global(.react-calendar) {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        :global(.react-calendar__tile) {
          padding: 1rem 0.5rem;
          position: relative;
        }
        :global(.react-calendar__tile.has-tasks) {
          color: #6B46C1;
          font-weight: 500;
        }
        :global(.react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus,
                .react-calendar__tile--active) {
          background-color: #EDE9FE !important;
          color: #6B46C1;
        }
        :global(.react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus) {
          background-color: #EDE9FE;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;