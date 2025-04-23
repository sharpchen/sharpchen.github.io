import matter from 'gray-matter';
import type { Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import { type DocumentName, documentService } from './DocumentService';
import { emojiService } from './EmojiService';
import type { IFeatureService } from './IFeatureService';
class FeatureService implements IFeatureService {
  readonly linkText: string = 'Get started';
  getFeaturesAsYaml(): string {
    return matter.stringify('', { features: this.getFeatures() });
  }
  getArticleFeatureAsYaml(): string {
    return matter.stringify('', { features: this.getArticleFeature() });
  }
  async getArticleFeature(): Promise<Feature[]> {
    const info = documentService.skillDocInfo['Articles' as DocumentName];
    return [
      {
        title: 'Articles' as DocumentName,
        details: info.description,
        icon: { src: await emojiService.getIconUrl(info.icon) },
        link: documentService.tryGetIndexLinkOfDocument('Articles' as DocumentName),
      },
    ];
  }
  async getReadingFeatures(): Promise<Feature[]> {
    return await Promise.all(
      Object.keys(documentService.readingDocInfo).map(async key => {
        const info = documentService.readingDocInfo[key];
        return {
          title: documentService.tryGetFormulaNameOfDocument(key as DocumentName),
          details: info.description,
          icon: { src: await emojiService.getIconUrl(info.icon) },
          link: documentService.tryGetIndexLinkOfDocument(key as DocumentName),
          linkText: this.linkText,
        };
      }),
    );
  }
  async getFeatures(): Promise<Feature[]> {
    return await Promise.all(
      Object.keys(documentService.skillDocInfo)
        .filter(key => key !== ('Articles' as DocumentName))
        .map(async key => {
          const info = documentService.skillDocInfo[key];
          return {
            title: documentService.tryGetFormulaNameOfDocument(key as DocumentName),
            details: info.description,
            icon: { src: await emojiService.getIconUrl(info.icon) },
            link: documentService.tryGetIndexLinkOfDocument(key as DocumentName),
            linkText: this.linkText,
          };
        }),
    );
  }
}

export const featureService: IFeatureService = new FeatureService();
