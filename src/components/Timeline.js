import React, { useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import timelineItemsData from "../timelineItems";
import assignLanes from "../assignLanes";
import "./Timeline.css";
import { format, addDays, differenceInDays, parseISO, add } from "date-fns";

const DAY_WIDTH = 40;

export default function Timeline() {
  const [items, setItems] = useState(timelineItemsData);

  const timelineStartDate = useMemo(() => {
    return items.reduce((earliestDate, item) => {
      return item.start < earliestDate ? item.start : earliestDate;
    }, items[0].start);
  }, [items]);

  const visibleDays = 108;
  const [startDate, setStartDate] = useState(parseISO(timelineStartDate));

  const lanes = assignLanes(items);

  const dateRange = useMemo(() => {
    return Array.from({ length: visibleDays }, (_, i) => addDays(startDate, i));
  }, [startDate, visibleDays]);

  const totalWidth = visibleDays * DAY_WIDTH;

  const getItemStyle = (item, laneIndex) => {
    const itemStart = parseISO(item.start);
    const itemEnd = parseISO(item.end);
    const offsetDays = differenceInDays(itemStart, startDate);
    const duration = Math.max(differenceInDays(itemEnd, itemStart) + 1, 1);

    return {
      left: offsetDays * DAY_WIDTH,
      width: duration * DAY_WIDTH - 4,
      top: laneIndex * 50,
      backgroundColor: item.color,
      position: "absolute"
    };
  };

  const handleDragStop = (item, data) => {
    const newOffsetDays = Math.round(data.x / DAY_WIDTH);
    const newStart = addDays(startDate, newOffsetDays);
    const oldStart = parseISO(item.start);
    const oldEnd = parseISO(item.end);
    const duration = differenceInDays(oldEnd, oldStart);
    const newEnd = add(newStart, { days: duration });

    const updatedItems = items.map(i =>
      i.id === item.id ? { ...i, start: newStart.toISOString(), end: newEnd.toISOString() } : i
    );

    setItems(updatedItems);
  };

  return (
    <div className="timeline-wrapper">
      {/* Header com nome do mês e dias */}
      <div className="timeline-header" style={{ width: totalWidth }}>
        <div className="timeline-months">
          {(() => {
            const chunks = [];
            let lastMonth = null;
            let currentChunk = [];

            dateRange.forEach((date, idx) => {
              const month = format(date, "MMMM");
              if (month !== lastMonth && currentChunk.length > 0) {
                chunks.push({ month: lastMonth, length: currentChunk.length });
                currentChunk = [];
              }
              currentChunk.push(date);
              lastMonth = month;

              if (idx === dateRange.length - 1) {
                chunks.push({ month, length: currentChunk.length });
              }
            });

            return chunks.map((chunk, idx) => (
              <div
                key={idx}
                className="month-label"
                style={{ width: `${chunk.length * DAY_WIDTH}px` }}
              >
                {chunk.month}
              </div>
            ));
          })()}
        </div>

        <div className="timeline-days">
          {dateRange.map((date, idx) => (
            <div key={idx} className="timeline-day">
              <div className="day-number">{format(date, "d")}</div>
              <div className="day-name">{format(date, "EEE")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Corpo com os eventos */}
      <div className="timeline-body" style={{ width: totalWidth }}>
        {lanes.map((lane, laneIndex) =>
          lane.map((item, itemIndex) => {
            const nodeRef = useRef(null);
            return (
              <Draggable
                key={item.id || `${laneIndex}-${itemIndex}`}
                axis="x"
                bounds="parent"
                nodeRef={nodeRef}
                position={null}
                onStop={(e, data) => handleDragStop(item, data)}
              >
                <div
                  ref={nodeRef}
                  className="timeline-item"
                  style={getItemStyle(item, laneIndex)}
                >
                  <div className="item-name">{item.name}</div>
                  <div className="item-dates">
                    {format(parseISO(item.start), "MMM d")} – {format(parseISO(item.end), "MMM d")}
                  </div>
                </div>
              </Draggable>
            );
          })
        )}
      </div>
    </div>
  );
}
