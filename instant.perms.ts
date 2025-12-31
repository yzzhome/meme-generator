import type { InstantRules } from '@instantdb/react';

// 允许任何人查看和上传文件
// 注意：在生产环境中，您可能需要更严格的权限控制
const rules = {
  $files: {
    allow: {
      view: true,
      create: true,
    },
  },
  memes: {
    allow: {
      view: true,
      create: true,
      update: true,
    },
  },
  upvotes: {
    allow: {
      view: true,
      create: true,
      delete: true,
      update: true,
    },
  },
} satisfies InstantRules;

export default rules;
