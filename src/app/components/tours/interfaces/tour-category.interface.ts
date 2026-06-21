import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface ITourCategory {
    slug: string;
    title: ILocalizedText;
    description?: ILocalizedText;
    image?: string;
    shortTitle: ILocalizedText;
}