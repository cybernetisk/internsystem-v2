import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "verv",
  title: "CYB verv",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
    },
    {
      name: "email",
      title: "Email",
      placeholder: "tittel@cyb.no",
      type: "string",
    },
    orderRankField({ type: "category" }),
  ],
};
