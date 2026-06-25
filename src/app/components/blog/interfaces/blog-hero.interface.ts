import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface IBlogHero {
    image: string;
    alt?: ILocalizedText;
    caption?: ILocalizedText;

}