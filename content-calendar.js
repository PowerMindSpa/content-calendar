function ContentCalendar() {
    const { useState } = React;
  
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [selectedColor, setSelectedColor] = useState("#ff0000");
    const [newEvent, setNewEvent] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const handleAddEvent = () => {
      if (!selectedDate || !newEvent) return;
      setEvents((prev) => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), { text: newEvent, color: selectedColor, completed: false }],
      }));
      setNewEvent("");
      setShowDialog(false);
    };

    const toggleComplete = (date, index) => {
      setEvents((prev) => {
        const updatedEvents = { ...prev };
        updatedEvents[date][index].completed = !updatedEvents[date][index].completed;
        return updatedEvents;
      });
    };

    return (
      React.createElement("div", { style: { padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" } }, 
        React.createElement("h2", { style: { textAlign: "center" } }, "Planlegg innleggene dine"),
        React.createElement("div", { style: { border: "1px solid #ddd", padding: "10px", borderRadius: "5px" } },
          React.createElement(ReactCalendar, {
            onClickDay: (value) => {
              setSelectedDate(value.toLocaleDateString("en-GB"));
              setShowDialog(true);
            },
            value: date,
            onChange: setDate,
            tileContent: ({ date }) =>
              (events[date.toLocaleDateString("en-GB")] || []).map((event, index) =>
                React.createElement("div", {
                  key: index,
                  style: {
                    padding: "5px",
                    backgroundColor: event.color,
                    borderRadius: "3px",
                    color: "#fff",
                    marginTop: "5px",
                    textDecoration: event.completed ? "line-through" : "none",
                    cursor: "pointer",
                  },
                  onClick: () => toggleComplete(date.toLocaleDateString("en-GB"), index)
                }, event.text)
              )
          })
        ),
        showDialog && React.createElement("div", { style: { padding: "20px", border: "1px solid #ccc", marginTop: "10px", background: "#f9f9f9", borderRadius: "5px" } },
          React.createElement("h3", null, "Legg til innlegg"),
          React.createElement("input", {
            type: "text",
            placeholder: "Skriv inn planen din...",
            value: newEvent,
            onChange: (e) => setNewEvent(e.target.value),
            style: { width: "100%", padding: "8px", marginBottom: "10px" }
          }),
          React.createElement("label", { style: { fontSize: "14px", fontWeight: "bold" } }, "Farge"),
          React.createElement("input", {
            type: "color",
            value: selectedColor,
            onChange: (e) => setSelectedColor(e.target.value),
            style: { width: "100%", padding: "8px", marginBottom: "10px" }
          }),
          React.createElement("button", {
            onClick: handleAddEvent,
            style: {
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }
          }, "Lagre")
        )
      )
    );
}

ReactDOM.render(React.createElement(ContentCalendar), document.getElementById("content-calendar"));
