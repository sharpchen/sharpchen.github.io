import type { DocumentIcon } from './DocumentService';
import type { EmojiHandler } from './EmojiService';
export type EmojiVariant =
  | 'noto-emoji-v2020-04-08-unicode12_1'
  | 'noto-emoji-v2.042'
  | 'animated-fluent-emoji'
  | 'animated-telegram-emoji';

export interface IEmojiService {
  globalVariant: EmojiVariant;
  emojiHandler: EmojiHandler;
  getIconUrl(emoji: DocumentIcon | string, variant?: EmojiVariant): Promise<string>;
  use(variant: EmojiVariant): this;
}
