'use client';

import { init } from '@instantdb/react';
import { schema, type AppSchema } from './schema';

const APP_ID = '19b91701-8651-46f9-8d30-ba85b80e929f';

export const db = init<AppSchema>({
  appId: APP_ID,
  schema,
});
