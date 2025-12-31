import { i } from "@instantdb/react";

const schema = i.schema({
  entities: {
    memes: i.entity({
      imageUrl: i.string(),
      imagePath: i.string(),
      createdAt: i.number(),
      upvotes: i.number(),
      authorId: i.string().optional(),
      authorName: i.string().optional(),
    }),
    upvotes: i.entity({
      memeId: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
  },
});

export type AppSchema = typeof schema;
const _schema: AppSchema = schema;
export default _schema;
