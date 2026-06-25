import { ILocalizedText } from '../../../interfaces/localized-text.interface';
import { ISeo } from '../../../interfaces/seo.interface';
import { IBlogContentBlock } from '../types/block.type';
import { IBlogHero } from './blog-hero.interface';


export interface IBlogPost {

    id: string;
    slug: string;
    categorySlugs?: string[];
    tagSlugs?: string[];
    title: ILocalizedText;
    description?: ILocalizedText;
    excerpt?: ILocalizedText;
    hero: IBlogHero;
    blocks: IBlogContentBlock[];
    author?: string;
    publishedAt?: string;
    updatedAt?: string;
    readingTime?: number;
    views?: number;
    featured?: boolean;
    popular?: boolean;
    status?: 'draft' | 'published';
    seo?: ISeo;
    relatedSlugs?: string[];
}