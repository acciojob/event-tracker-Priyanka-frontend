import React, { useMemo, useState } from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./../styles/App.css";

const localizer = BigCalendar.momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  const [popupType, setPopupType] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const filteredEvents = useMemo(() => {
    const now = new Date();

    if (filter === "past") {
      return events.filter((event) => event.start < now);
    }

    if (filter === "upcoming") {
      return events.filter((event) => event.start >= now);
    }

    return events;
  }, [events, filter]);

  // Create event by selecting a calendar date
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setSelectedEvent(null);
    setTitle("");
    setLocation("");
    setPopupType("create");
  };

  // Add Event button
  const openCreatePopup = () => {
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setTitle("");
    setLocation("");
    setPopupType("create");
  };

  // Save new event
  const saveEvent = () => {
    if (!title.trim()) {
      return;
    }

    const startDate = selectedDate || new Date();

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      location: location.trim(),
      start: startDate,
      end: moment(startDate).add(1, "hour").toDate(),
    };

    setEvents((prev) => [...prev, newEvent]);

    closePopup();
  };

  // Click existing event
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setLocation(event.location || "");
    setPopupType("event");
  };

  // Open edit popup
  const openEditPopup = () => {
    if (!selectedEvent) return;

    setTitle(selectedEvent.title);
    setLocation(selectedEvent.location || "");
    setPopupType("edit");
  };

  // Save edited event
  const saveEditedEvent = () => {
    if (!selectedEvent || !title.trim()) {
      return;
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: title.trim(),
              location: location.trim(),
            }
          : event,
      ),
    );

    closePopup();
  };

  // Delete event
  const deleteEvent = () => {
    if (!selectedEvent) return;

    setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));

    closePopup();
  };

  // Close popup
  const closePopup = () => {
    setPopupType(null);
    setSelectedEvent(null);
    setTitle("");
    setLocation("");
  };

  // Event colors
  const eventStyleGetter = (event) => {
    const isPast = event.start < new Date();

    return {
      style: {
        backgroundColor: isPast ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)",
        borderRadius: "4px",
        color: "white",
        border: "none",
      },
    };
  };

  return (
    <div className="app">
      <h1>Event Tracker</h1>

      <div className="toolbar">
        <button className="btn" onClick={() => setFilter("all")}>
          All
        </button>

        <button className="btn" onClick={() => setFilter("past")}>
          Past
        </button>

        <button className="btn" onClick={() => setFilter("upcoming")}>
          Upcoming
        </button>

        <button className="btn" onClick={openCreatePopup}>
          Add Event
        </button>
      </div>

      <BigCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        style={{ height: 600 }}
      />

      {/* CREATE EVENT POPUP */}
      {popupType === "create" && (
        <div className="mm-popup">
          <div className="mm-popup__overlay" onClick={closePopup}></div>

          <div className="mm-popup__box">
            <div className="mm-popup__box__body">
              <input
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                placeholder="Event Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="mm-popup__box__footer">
              <div className="mm-popup__box__footer__right-space">
                <button className="mm-popup__btn" onClick={saveEvent}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVENT DETAILS POPUP */}
      {popupType === "event" && selectedEvent && (
        <div className="mm-popup">
          <div className="mm-popup__overlay" onClick={closePopup}></div>

          <div className="mm-popup__box">
            <div className="mm-popup__box__body">
              <h3>{selectedEvent.title}</h3>

              <p>{selectedEvent.location}</p>
            </div>

            <div className="mm-popup__box__footer">
              <button className="mm-popup__btn--info" onClick={openEditPopup}>
                Edit
              </button>

              <button className="mm-popup__btn--danger" onClick={deleteEvent}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT EVENT POPUP */}
      {popupType === "edit" && selectedEvent && (
        <div className="mm-popup">
          <div className="mm-popup__overlay" onClick={closePopup}></div>

          <div className="mm-popup__box">
            <div className="mm-popup__box__body">
              <input
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                placeholder="Event Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="mm-popup__box__footer">
              <div className="mm-popup__box__footer__right-space">
                <button className="mm-popup__btn" onClick={saveEditedEvent}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
