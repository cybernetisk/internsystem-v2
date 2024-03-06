import { orderRankField } from "@sanity/orderable-document-list";



const board = (name, title) => {
  return {
    name: name,
    title: title,
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "reference",
        to: [{ type: "verv" }],
      },
      {
        name: "name",
        title: "Name",
        type: "string",
      },
      {
        name: "duration",
        title: "Duration",
        placeholder: "V23, H23, V23-H23",
        type: "string",
      },
      {
        name: "portrait",
        title: "Portrait",
        type: "image",
        options: {
          hotspot: true,
        },
      },
      orderRankField({ type: "category" }),
    ],
    preview: {
      select: {
        title: "title.title",
        media: "portrait",
      },
      prepare(selection) {
        const { title, media } = selection;
        return {
          title: title ? title : "bruh",
          media: media ? media : null,
        };
      },
    },
  };
}

const hovedstyret = board("hovedstyret", "Hovedstyret");
const kjellerstyret = board("kjellerstyret", "Kjellerstyret");

export { hovedstyret, kjellerstyret }