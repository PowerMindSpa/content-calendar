import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { SketchPicker } from "react-color";

export default function ContentCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [newEvent, setNewEvent] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">Planlegg innleggene dine</h2>
      <Card>
        <CardContent>
          <ReactCalendar
            onClickDay={(value) => {
              setSelectedDate(value.toLocaleDateString("en-GB"));
              setShowDialog(true);
            }}
            value={date}
            onChange={setDate}
            tileContent={({ date }) =>
              events[date.toLocaleDateString("en-GB")]?.map((event, index) => (
                <div
                  key={index}
                  className={`p-1 text-white rounded-md text-xs text-center ${event.completed ? 'line-through' : ''}`}
                  style={{ backgroundColor: event.color }}
                  onClick={() => toggleComplete(date.toLocaleDateString("en-GB"), index)}
                >
                  {event.text}
                </div>
              ))
            }
          />
        </CardContent>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <h3 className="text-lg font-semibold mb-2">Legg til innlegg</h3>
          <Input
            placeholder="Skriv inn planen din..."
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
          <div className="mt-2">
            <label className="text-sm font-medium">Farge</label>
            <SketchPicker
              color={selectedColor}
              onChangeComplete={(color) => setSelectedColor(color.hex)}
            />
          </div>
          <Button onClick={handleAddEvent} className="mt-4 w-full">Lagre</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}