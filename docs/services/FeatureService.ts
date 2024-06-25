import matter from 'gray-matter';
import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import { DocumentName, documentService } from './DocumentService';
import { emojiService } from './EmojiService';
import { IFeatureService } from './IFeatureService';
class FeatureService implements IFeatureService {
  readonly linkText: string = 'Get started';
  getFeaturesAsYaml(): string {
    return matter.stringify('', { features: this.getFeatures() });
  }
  getArticleFeatureAsYaml(): string {
    return matter.stringify('', { features: this.getArticleFeature() });
  }
  async getArticleFeature(): Promise<Feature[]> {
    const info = documentService.documentInfo['Articles' as DocumentName];
    return [
      {
        title: 'Articles' as DocumentName,
        details: info.description,
        icon: { src: await emojiService.getIconUrl(info.icon) },
        link: documentService.tryGetIndexLinkOfDocument('Articles' as DocumentName),
      },
    ];
  }
  async getFeatures(): Promise<Feature[]> {
    // const features: Feature[] = [];
    // for (const key in documentService.documentInfo) {
    //   if (Object.prototype.hasOwnProperty.call(documentService.documentInfo, key)) {
    //     const documentInfo = documentService.documentInfo[key];
    //     if ((key as DocumentName) !== 'Articles')
    //       features.push({
    //         title: documentService.tryGetFormulaNameOfDocument(key as DocumentName),
    //         details: documentInfo.description,
    //         icon: { src: await emojiService.getIconUrl(documentInfo.icon) },
    //         link: documentService.tryGetIndexLinkOfDocument(key as DocumentName),
    //         linkText: this.linkText,
    //       });
    //   }
    // }

    // return features;
    return await Promise.all(
      Object.keys(documentService.documentInfo)
        .filter(key => key !== ('Articles' as DocumentName))
        .map(async key => {
          const documentInfo = documentService.documentInfo[key];
          return {
            title: documentService.tryGetFormulaNameOfDocument(key as DocumentName),
            details: documentInfo.description,
            icon: { src: await emojiService.getIconUrl(documentInfo.icon) },
            link: documentService.tryGetIndexLinkOfDocument(key as DocumentName),
            linkText: this.linkText,
          };
        })
    );
  }
}

export const featureService: IFeatureService = new FeatureService();
