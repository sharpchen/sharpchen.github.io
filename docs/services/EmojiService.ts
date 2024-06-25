import fg from 'fast-glob';
import { projectRoot } from '../shared/FileSystem';
import { DocumentIcon } from './DocumentService';
import { getRepoFileInfo, githubService } from './GithubService';
import { EmojiVariant, IEmojiService } from './IEmojiService';

export abstract class EmojiHandler {
  next: EmojiHandler;
  abstract shouldHandle(variant: EmojiVariant): boolean;
  abstract getEmojiUrl(variant: EmojiVariant, emoji: DocumentIcon): Promise<string>;
  async handle(variant: EmojiVariant, emoji: DocumentIcon): Promise<string> {
    return this.shouldHandle(variant)
      ? await this.getEmojiUrl(variant, emoji)
      : await this.next.handle(variant, emoji);
  }
  chain(next: EmojiHandler): EmojiHandler {
    return (this.next = next);
  }
  getHexOfEmoji(emoji: DocumentIcon | string): string {
    const ret = emoji.codePointAt(0)?.toString(16);
    if (!ret) throw new Error(`Unicode of emoji: "${emoji}" not found.`);
    return ret;
  }
}
class FluentEmojiHandler extends EmojiHandler {
  shouldHandle(variant: EmojiVariant): boolean {
    return variant === 'animated-fluent-emoji';
  }
  async getEmojiUrl(variant: EmojiVariant, emoji: DocumentIcon): Promise<string> {
    const hex = this.getHexOfEmoji(emoji);
    const match = (await githubService.fromRepository('bignutty/fluent-emoji').getTree()).filter(
      x => x.path?.includes(hex) && x.path.includes('animated-static')
    );
    if (!match.length) throw new Error(`APNG path of emoji ${emoji} not found. Hex: ${hex}`);
    const path = match[0].path;
    const file = await getRepoFileInfo('bignutty/fluent-emoji', path!);
    if (!file) throw new Error(`file of path: ${path} is ${file}`);
    const url = file.download_url!;
    return url;
  }
}
class NotoEmojiHandler extends EmojiHandler {
  shouldHandle(variant: EmojiVariant): boolean {
    return variant === 'noto-emoji-v2.042' || variant === 'noto-emoji-v2020-04-08-unicode12_1';
  }
  async getEmojiUrl(variant: EmojiVariant, emoji: DocumentIcon): Promise<string> {
    const hex = this.getHexOfEmoji(emoji);
    const match = fg.globSync(`**/${variant}/**/emoji_u${hex}.svg`, {
      cwd: `${projectRoot().fullName}/public`,
    });
    if (!match.length) throw new Error(`Svg path of emoji ${emoji} not found. Hex: ${hex}`);
    return `/${match[0]}`;
  }
}

class EmojiService implements IEmojiService {
  emojiHandler: EmojiHandler = new NotoEmojiHandler().chain(new FluentEmojiHandler());
  globalVariant: EmojiVariant = 'noto-emoji-v2020-04-08-unicode12_1';
  use(variant: EmojiVariant): this {
    this.globalVariant = variant;
    return this;
  }
  async getIconUrl(emoji: DocumentIcon, variant?: EmojiVariant): Promise<string> {
    return await this.emojiHandler.handle(variant ?? this.globalVariant, emoji);
  }
}
export const emojiService: IEmojiService = new EmojiService().use('animated-fluent-emoji');
