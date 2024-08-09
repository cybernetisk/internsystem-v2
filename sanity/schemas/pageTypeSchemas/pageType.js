
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: "page",
  title: "Page",
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
    //   name: "content",
    //   title: "Content",
    //   type: "array",
    //   of: [{ type: "block" }],
    // },
    // {
    //   name: "images",
    //   title: "Images",
    //   type: "gallery",
    // },
  ],
});