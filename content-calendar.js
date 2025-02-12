// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgLacOAYPBG4gSjj3Ay4R3W5ibG5p4Uzs",
  authDomain: "content-calendar-76036.firebaseapp.com",
  projectId: "content-calendar-76036",
  storageBucket: "content-calendar-76036.firebasestorage.app",
  messagingSenderId: "970269174698",
  appId: "1:970269174698:web:412ced3895ff69fb0d59d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


function ContentCalendar() {
    const { useState, useEffect } = window.React;

    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [selectedColor, setSelectedColor] = useState("#ff0000");
    const [newEvent, setNewEvent] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        window.db.collection("calendar-events")
          .get()
          .then((snapshot) => {
              let data = {};
              snapshot.forEach((doc) => {
                  data[doc.id] = doc.data().events;
              });
              setEvents(data);
          });
    }, []);

    const handleAddEvent = () => {
        if (!selectedDate || !newEvent) return;

        const newEvents = [...(events[selectedDate] || []), { text: newEvent, color: selectedColor, completed: false }];
        setEvents({ ...events, [selectedDate]: newEvents });

        window.db.collection("calendar-events")
          .doc(selectedDate)
          .set({ events: newEvents });

        setNewEvent("");
        setShowDialog(false);
    };

    const toggleComplete = (date, index) => {
        const updatedEvents = [...events[date]];
        updatedEvents[index].completed = !updatedEvents[index].completed;

        setEvents({ ...events, [date]: updatedEvents });

        window.db.collection("calendar-events")
          .doc(date)
          .set({ events: updatedEvents });
    };

    return (
        window.React.createElement("div", { style: { padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" } }, 
            window.React.createElement("h2", { style: { textAlign: "center" } }, "Planlegg innleggene dine"),
            window.React.createElement("div", { style: { border: "1px solid #ddd", padding: "10px", borderRadius: "5px" } },
                window.React.createElement(window.ReactCalendar, {
                    onClickDay: (value) => {
                        setSelectedDate(value.toLocaleDateString("en-GB"));
                        setShowDialog(true);
                    },
                    value: date,
                    onChange: setDate,
                    tileContent: ({ date }) =>
                        (events[date.toLocaleDateString("en-GB")] || []).map((event, index) =>
                            window.React.createElement("div", {
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
            )
        )
    );
}

