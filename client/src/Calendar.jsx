import React, { useState } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date()); // State to track the current date
  const [view, setView] = useState('week'); // State to track the current view (month, week, day)

  // Function to get the number of days in a month
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Function to get the first day of the month
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Function to render the month view
  const renderMonthView = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    const calendarDays = [];
    // Add empty days for the first week
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= days; day++) {
      calendarDays.push(<div key={day} className="calendar-day">{day}</div>);
    }

    return calendarDays;
  };

  // Function to render the week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const calendarDays = [];
    // Add days of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      calendarDays.push(<div key={i} className="calendar-day">{day.getDate()}</div>);
    }

    return calendarDays;
  };

  // Function to render the day view
  const renderDayView = () => {
    return <div className="calendar-day">{currentDate.getDate()}</div>;
  };

  // Function to handle previous button click
  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    }
  };

  // Function to handle next button click
  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrev}>Previous</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={handleNext}>Next</button>
      </div>
      <div className="calendar-view-buttons">
        <button onClick={() => setView('month')}>Month</button>
        <button onClick={() => setView('week')}>Week</button>
        <button onClick={() => setView('day')}>Day</button>
      </div>
      <div className="calendar-grid">
        {view === 'month' && (
          <>
            <div className="calendar-day-name">Sun</div>
            <div className="calendar-day-name">Mon</div>
            <div className="calendar-day-name">Tue</div>
            <div className="calendar-day-name">Wed</div>
            <div className="calendar-day-name">Thu</div>
            <div className="calendar-day-name">Fri</div>
            <div className="calendar-day-name">Sat</div>
            {renderMonthView()}
          </>
        )}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>
    </div>
  );
}

export default Calendar;