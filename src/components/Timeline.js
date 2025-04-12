import React, { useMemo, useState } from "react";
import timelineItems from "../timelineItems";
import assignLanes from "../assignLanes";
import "./Timeline.css";
import { format, addDays, differenceInDays, parseISO } from "date-fns";


const DAY_WIDTH = 40;

export default function Timeline() {
  const timelineStartDate = useMemo(() => {
    return timelineItems.reduce((earliestDate, item) => {
      return item.start < earliestDate ? item.start : earliestDate;
    }, timelineItems[0].start);
  }, []);


  const visibleDays= 108;

  const [startDate, setStartDate] = useState(parseISO(timelineStartDate)); 
  const lanes = assignLanes(timelineItems);

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
    };
  };

  return (
    <div className="timeline-wrapper">
      <div className="timeline-header" style={{ width: totalWidth }}>
        {dateRange.map((date, idx) => {
      const isFirstOfMonth = idx === 0 || format(date, "MMM") !== format(dateRange[idx - 1], "MMM");
       return (
      <div key={idx} className="timeline-day">
        {isFirstOfMonth && (
          <div className="month-name" style={{ gridColumn: `span 1` }}>
            {format(date, "MMMM")}
          </div>
        )}
        <div className="day-number">{format(date, "d")}</div>
        <div className="day-name">{format(date, "EEE")}</div>
      </div>
    );
      })}
    </div>
      
      {/* Body withh timelines*/}
      <div className="timeline-body" style={{ width: totalWidth }}>
        {lanes.map((lane, laneIndex) =>
          lane.map((item, itemIndex) => (
            <div
              key={item.id || `${laneIndex}-${itemIndex}`}
              className="timeline-item"
              style={getItemStyle(item, laneIndex)}
            >
              <div className="item-name">{item.name}</div>
              <div className="item-dates">
                {format(parseISO(item.start), "MMM d")} – {format(parseISO(item.end), "MMM d")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

























































