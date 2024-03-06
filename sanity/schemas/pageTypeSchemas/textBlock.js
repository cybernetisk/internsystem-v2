
import {defineField, defineType} from 'sanity'

export default defineType({
  name: "textblock",
  type: "object",
  title: "Text block",
  fields: [
    defineField({
      name: "heading",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "text",
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title, image }) {
      return {
        title: title || "Untitled",
        subtitle: "Text block",
      };
    },
  },
});