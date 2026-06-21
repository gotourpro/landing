import { ILocalizedText } from '../../../interfaces/localized-text.interface';

export interface IBlogPost {

    id: string;

    slug: string;

    categorySlug: string;

    title: ILocalizedText;

    description?: ILocalizedText;

    excerpt?: ILocalizedText;

    content?: ILocalizedText;

    image: string;

    images?: string[];

    tags?: string[];

    author?: string;

    publishedAt?: string;

    readingTime?: number;

    views?: number;

    featured?: boolean;

    popular?: boolean;
}