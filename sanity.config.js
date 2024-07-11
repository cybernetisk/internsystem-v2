/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\sanity\[[...index]]\page.jsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { schemaTypes } from "./sanity/schemas";

import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'

export default defineConfig({
  basePath: "/studio",
  projectId: projectId,
  dataset: dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S, context) => {
        return S.list()
          .title("Content")
          .items([
            // Minimum required configuration
            // orderableDocumentListDeskItem({ type: "hovedstyret", title: "Hovedstyret", S, context }),
            // orderableDocumentListDeskItem({ type: "kjellerstyret", title: "Kjellerstyret", S, context }),
            S.documentTypeListItem("boardPosition"),
            S.documentTypeListItem("page"),
            S.documentTypeListItem("event"),
            orderableDocumentListDeskItem({ type: "workGroup", title: "Work groups", S, context }),
            // S.documentTypeListItem("interngruppe"),
          ]);
      },
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
