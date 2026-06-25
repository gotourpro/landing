import { ILocalizedText } from "./localized-text.interface";

export interface ISeo {
    title?: ILocalizedText;
    description?: ILocalizedText;
    keywords?: ILocalizedText;
    image?: string;
    type?: 'website' | 'article';
}