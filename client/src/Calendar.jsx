import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

function Calendar() {
  const { recipes, events, setEvents } = useOutletContext();
  const [currentDate, setCurrentDate] = useState(new Date()); // State to track the current date
  const [view, setView] = useState('week'); // State to track the current view (month, week, day)
  const [hoveredDate, setHoveredDate] = useState(null); // State to track the hovered date
  const [selectedDate, setSelectedDate] = useState(null); // State to track the selected date for adding event
  const [searchTerm, setSearchTerm] = useState(''); // State to track the search term
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State to track the filtered recipes

  // Function to get the CSRF token from cookies
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Function to get the number of days in a month
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Function to get the first day of the month
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Function to fetch events
  const fetchEvents = async () => {
    const res = await fetch('/events/', {
      credentials: 'same-origin',
    });
    const body = await res.json();
    setEvents(body.events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event => new Date(event.date).toDateString() === date.toDateString());
      calendarDays.push(
        <div
          key={day}
          className="calendar-day"
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div className="date">{day}</div>
          {dayEvents.map(event => (
            <Link key={event.id} to={`/ViewRecipe/${event.id}`}>
              <div className="event">{event.recipe.title}</div>
            </Link>
          ))}
          {hoveredDate && hoveredDate.getDate() === day && (
            <button onClick={() => setSelectedDate(date)}>Add Event</button>
          )}
        </div>
      );
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
      const dayEvents = events.filter(event => new Date(event.date).toDateString() === day.toDateString());
      calendarDays.push(
        <div
          key={i}
          className="calendar-day"
          onMouseEnter={() => setHoveredDate(day)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div className="date">{day.getDate()}</div>
          {dayEvents.map(event => (
            <Link key={event.id} to={`/ViewRecipe/${event.id}`}>
              <div className="event">{event.recipe.title}</div>
            </Link>
          ))}
          {hoveredDate && hoveredDate.getDate() === day.getDate() && (
            <button onClick={() => setSelectedDate(day)}>Add Event</button>
          )}
        </div>
      );
    }

    return calendarDays;
  };

  // Function to render the day view
  const renderDayView = () => {
    const dayEvents = events.filter(event => new Date(event.date).toDateString() === currentDate.toDateString());
    return (
      <div
        className="calendar-day"
        onMouseEnter={() => setHoveredDate(currentDate)}
        onMouseLeave={() => setHoveredDate(null)}
      >
        <div className="date">{currentDate.getDate()}</div>
        {dayEvents.map(event => (
          <Link key={event.id} to={`/ViewRecipe/${event.id}`}>
            <div className="event">{event.recipe.title}</div>
          </Link>
        ))}
        {hoveredDate && hoveredDate.getDate() === currentDate.getDate() && (
          <button onClick={() => setSelectedDate(currentDate)}>Add Event</button>
        )}
      </div>
    );
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

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const results = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(results);
  };

  // Function to handle adding event
  const handleAddEvent = (recipeId) => {
    const csrftoken = getCookie('csrftoken');
    fetch('/add_event/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({
        recipe_id: recipeId,
        date: selectedDate.toISOString().split('T')[0],
      }),
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        setSelectedDate(null);
        setSearchTerm('');
        setFilteredRecipes([]);
        fetchEvents(); // Refresh events after adding a new one
      });
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
      {selectedDate && (
        <div className="add-event-modal">
          <h3>Add Event for {selectedDate.toDateString()}</h3>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <div key={recipe.id}>
                  <h2>{recipe.title}</h2>
                  <button onClick={() => handleAddEvent(recipe.id)}>Add Event</button>
                </div>
              ))
            ) : (
              <p>No recipes found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;