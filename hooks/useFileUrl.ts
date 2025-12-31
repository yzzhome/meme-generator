'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';

const APP_ID = '19b91701-8651-46f9-8d30-ba85b80e929f';

/**
 * Hook to get file URL from InstantDB Storage
 * Tries to query $files namespace, falls back to constructed URL
 */
export function useFileUrl(path: string | undefined, fallbackUrl: string, fileId?: string): string {
  const [url, setUrl] = useState(fallbackUrl);

  // Try to query $files namespace if we have a fileId
  // Note: $files is a built-in namespace, doesn't need to be in schema
  const { data } = db.useQuery(
    fileId
      ? {
          $files: {
            $: {
              where: { id: fileId },
            },
          },
        }
      : {}
  );

  useEffect(() => {
    // If we got a URL from $files query, use it
    if (data?.$files && Array.isArray(data.$files) && data.$files.length > 0 && data.$files[0].url) {
      setUrl(data.$files[0].url);
      return;
    }

    // Otherwise, try to construct URL from path
    if (path) {
      // Try CDN URL first (InstantDB's recommended format)
      const cdnUrl = `https://cdn.instantdb.com/${APP_ID}/${path}`;
      setUrl(cdnUrl);
    } else {
      // Fall back to provided URL
      setUrl(fallbackUrl);
    }
  }, [data, path, fallbackUrl, fileId]);

  return url;
}
