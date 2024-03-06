
import {defineField, defineType} from 'sanity'

export default defineType({
  name: "gallery",
  type: "object",
  title: "Gallery",
  fields: [
    defineField({
      name: "heading",
      type: "string",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineField({
          name: "image",
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title, image }) {
      return {
        title: title || "Untitled",
        subtitle: "gallery",
      };
    },
  },
});