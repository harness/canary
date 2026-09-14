import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        beta: z.boolean().optional().default(false),
        // Marks the full-width landing page (rendered without the docs sidebar).
        home: z.boolean().optional().default(false),
      }),
    }),
  }),
};
