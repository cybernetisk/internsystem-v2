import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "eventStart",
      title: "Event start",
      type: "datetime",
      initialValue: new Date(),
      options: {
        dateFormat: "DD MMMM yyyy",
        timeFormat: "kk:mm",
        timeStep: 5,
        calendarTodayLabel: "Today",
      },
    },
    {
      name: "eventEnd",
      title: "Event End",
      type: "datetime",
      initialValue: new Date().setHours(1),
      options: {
        dateFormat: "DD MMMM yyyy",
        timeFormat: "kk:mm",
        timeStep: 5,
        // calendarTodayLabel: "Today",
      },
    },
    {
      title: "Content",
      name: "content",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Images",
      name: "images",
      type: "gallery",
    },
    // {
    //   name: "email",
    //   title: "Email",
    //   placeholder: "tittel@cyb.no",
    //   type: "string",
    // },
    orderRankField({ type: "category" }),
  ],
};
