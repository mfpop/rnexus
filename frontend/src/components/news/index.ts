export { default as NewsLeftCardSimple } from "./NewsLeftCardSimple";
export { default as NewsLeftCardWrapper } from "./NewsLeftCardWrapper";
export { default as NewsRightCard } from "./NewsRightCard";
export {
  default as NewsContext,
  useNewsContext,
  NewsProvider,
} from "./NewsContextNew";
export type { Update, UpdateExtended } from "./NewsContextNew";

// Legacy types for backward compatibility - need to be defined here
export interface UpdateContent {
  body: string;
  attachments: any[];
  media: any[];
  related: any[];
}

export interface UpdateAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface UpdateMedia {
  id: string;
  type: string;
  url: string;
  thumbnail?: string;
}
