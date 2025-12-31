import { i } from "@instantdb/react";

export const schema = i.schema({
  entities: {
    // $files 是 InstantDB Storage 的内置命名空间，需要在 schema 中定义才能查询
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    memes: i.entity({
      imageUrl: i.string().optional(), // URL 将从 $files 查询获取
      imagePath: i.string(),
      imageFileId: i.string().optional(), // 存储文件 ID 用于查询 $files
      createdAt: i.number(),
      upvotes: i.number(),
      authorId: i.string().optional(), // InstantDB 用户 ID
      authorName: i.string().optional(), // 用户显示名称
    }),
    upvotes: i.entity({
      memeId: i.string(),
      userId: i.string(), // InstantDB 用户 ID
      createdAt: i.number(),
    }),
  },
});

export type AppSchema = typeof schema;
