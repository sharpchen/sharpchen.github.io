import { DocumentIcon } from './DocumentService';
export interface IEmojiService {
  getIcon(emoji: DocumentIcon | string): string;
  getHexOfEmoji(emoji: DocumentIcon | string): string;
}
