import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import { featureService } from '../services/FeatureService';

const featuresItems: Feature[] = featureService.getFeatures();
const articleFeature: Feature[] = featureService.getArticleFeature();
const loader = {
  load: (): FeatureCompose => ({ features: featuresItems, articleFeature: articleFeature }),
};

export default loader;
type FeatureCompose = {
  features: Feature[];
  articleFeature: Feature[];
};

export declare const data: FeatureCompose;
