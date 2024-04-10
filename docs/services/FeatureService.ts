import matter from 'gray-matter';
import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import { DocumentName, documentService } from './DocumentService';
import { IFeatureService } from './IFeatureService';
export class FeatureService implements IFeatureService {
  readonly linkText: string = 'Get started';
  getFeaturesAsYaml(): string {
    return matter.stringify('', { features: this.getFeatures() });
  }
  getArticleFeatureAsYaml(): string {
    return matter.stringify('', { features: this.getArticleFeature() });
  }
  getArticleFeature(): Feature[] {
    const info = documentService.documentInfo['Articles' as DocumentName];
    return [
      {
        title: 'Articles' as DocumentName,
        details: info.description,
        icon: info.icon,
        link: documentService.tryGetIndexLinkOfDocument('Articles' as DocumentName),
      },
    ];
  }
  getFeatures(): Feature[] {
    const features: Feature[] = [];
    for (const key in documentService.documentInfo) {
      if (Object.prototype.hasOwnProperty.call(documentService.documentInfo, key)) {
        const documentInfo = documentService.documentInfo[key];
        if ((key as DocumentName) !== 'Articles')
          features.push({
            title: documentService.tryGetFormulaNameOfDocument(key as DocumentName),
            details: documentInfo.description,
            icon: documentInfo.icon,
            link: documentService.tryGetIndexLinkOfDocument(key as DocumentName),
            linkText: this.linkText,
          });
      }
    }
    return features;
  }
}

export const featureService: IFeatureService = new FeatureService();
