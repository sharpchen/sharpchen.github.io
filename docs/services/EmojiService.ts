import fg from 'fast-glob';
import { projectRoot } from '../shared/FileSystem';
import { DocumentIcon } from './DocumentService';
import { IEmojiService } from './IEmojiService';
class EmojiService implements IEmojiService {
  getIcon(emoji: DocumentIcon | string): string {
    const hex = this.getHexOfEmoji(emoji);
    const match = fg.globSync(`**/emoji_u${hex}.svg`, {
      cwd: `${projectRoot().fullName}/public`,
    });
    if (!match.length) throw new Error(`Svg path of emoji ${emoji} not found. Hex: ${hex}`);
    return `/${match[0]}`;
  }
  getHexOfEmoji(emoji: DocumentIcon | string): string {
    const ret = emoji.codePointAt(0)?.toString(16);
    if (!ret) throw new Error(`Unicode of emoji: "${emoji}" not found.`);
    return ret;
  }
}
export const emojiService: IEmojiService = new EmojiService();
