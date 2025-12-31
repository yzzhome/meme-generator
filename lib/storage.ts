'use client';

import { db } from './db';

/**
 * Uploads a meme image to InstantDB Storage
 * Returns the file path and fileId (URL will be queried in component via $files)
 */
export async function uploadMemeImage(file: File): Promise<{ path: string; fileId: string }> {
  const timestamp = Date.now();
  const fileName = `memes/${timestamp}-${file.name}`;
  
  try {
    console.log('Uploading file:', fileName, 'Size:', file.size);
    
    // 上传文件
    const uploadResult = await db.storage.uploadFile(fileName, file);
    console.log('Upload result (full):', JSON.stringify(uploadResult, null, 2));
    
    const fileId = uploadResult?.data?.id;
    console.log('File ID from upload:', fileId);
    
    if (!fileId) {
      throw new Error('上传失败：未获取到文件 ID');
    }
    
    // 返回路径和文件 ID，URL 将在组件中通过查询 $files 获取
    return { path: fileName, fileId };
  } catch (error) {
    console.error('Error uploading image:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
