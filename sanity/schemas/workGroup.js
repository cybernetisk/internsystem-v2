import { orderRankField } from "@sanity/orderable-document-list";

export default {
  name: "workGroup",
  title: "Work group",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "header",
      title: "Header",
      type: "string",
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
