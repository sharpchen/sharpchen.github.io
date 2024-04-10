import { Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';

export interface IFeatureService {
  getFeaturesAsYaml(): string;
  getArticleFeatureAsYaml(): string;
  getFeatures(): Feature[];
  getArticleFeature(): Feature[];
}
