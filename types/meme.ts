export interface TextElement {
  id: string;
  content: string;
  x: number; // 相对于容器的百分比
  y: number; // 相对于容器的百分比
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
}

export interface MemeEditorState {
  currentImage: HTMLImageElement | null;
  textElements: TextElement[];
  selectedTextId: string | null;
  currentTextColor: string;
  currentFontFamily: string;
  currentFontWeight: string;
  currentFontStyle: string;
}

export interface Meme {
  id: string;
  imageUrl?: string;
  imagePath: string;
  imageFileId?: string;
  createdAt: number;
  upvotes: number;
  authorId?: string;
  authorName?: string;
}

export interface Upvote {
  id: string;
  memeId: string;
  userId: string;
  createdAt: number;
}
