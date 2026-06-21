import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface IBlogCategory {
    slug: string;
    title: ILocalizedText;
    description?: ILocalizedText;
    image?: string;
    shortTitle: ILocalizedText;
}