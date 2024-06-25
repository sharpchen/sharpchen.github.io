import Enumerable from 'linq';
import { type Feature } from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import { featureService } from '../services/FeatureService';
const featuresItems: Feature[] = Enumerable.from(await featureService.getFeatures())
  .orderBy(_x => Math.random())
  .toArray();
const articleFeature: Feature[] = await featureService.getArticleFeature();
const loader = {
  load: (): FeatureCompose => ({ features: featuresItems, articleFeature: articleFeature }),
};

export default loader;
type FeatureCompose = {
  features: Feature[];
  articleFeature: Feature[];
};

export declare const data: FeatureCompose;
