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
      name: "pageContent",
      title: "Page content",
      type: "array",
      of: [
        {
          type: "object",
          name: "contentSection",
          title: "Content Section",
          fields: [
            {
              name: "text",
              title: "Text",
              type: "array",
              of: [{ type: "block" }],
            },
            {
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "image" }],
              options: {
                layout: "grid",
              },
            },
          ],
          preview: {
            select: {
              title: "text.0.children.0.text",
              media: "images.0.asset",
            },
            prepare({ title, media }) {
              return {
                title: title || "No title",
                media,
              };
            },
          },
        },
      ],
    },
    // {
    //   title: "Content",
    //   name: "content",
    //   type: "array",
    //   of: [{ type: "block" }],
    // },
    // {
    //   title: "Images",
    //   name: "images",
    //   type: "gallery",
    // },
    // {
    //   name: "email",
    //   title: "Email",
    //   placeholder: "tittel@cyb.no",
    //   type: "string",
    // },
    orderRankField({ type: "category" }),
  ],
};
