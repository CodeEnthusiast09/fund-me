"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { formatTime } from "@/lib/utils";

export const Calendar = ({
  events,
  eventClick,
  contentHeight = "60vh",
}: {
  events: any;
  eventClick?: Function;
  contentHeight?: string
}) => {
  const handleDateClick = (info: any) => {
    if (info?.event?.id) {
      const event = events?.filter(
        (event: any) => event?.id === info?.event?.id
      )?.[0];

      eventClick?.(event?.item ?? event);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridYear,dayGridMonth,timeGridWeek,dayGridDay,listWeek",
      }}
      initialView="dayGridMonth"
      nowIndicator={true}
      selectable={true}
      eventColor="#201C51"
      eventClassNames={
        "h-full bg-primary-500 hover:bg-primary-100 text-white hover:text-primary-500 duration-300 ease-in-out cursor-pointer rounded px-3 my-2"
      }
      events={events}
      contentHeight={contentHeight}
      stickyHeaderDates={true}
      eventClick={handleDateClick}
      eventContent={renderEventContent}
    />
  );
};

function renderEventContent(eventInfo: any) {
  return (
    <div className="truncate capitalize">
      <div>{eventInfo.event.title}</div>
      {eventInfo?.event?.start && eventInfo?.event?.end && (
        <div className="text-xs font-light">
          {formatTime(eventInfo?.event?.start)} -{" "}
          {formatTime(eventInfo?.event?.end)}
        </div>
      )}
    </div>
  );
}
