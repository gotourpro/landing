import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface IBlogImage {
    src: string;
    alt?: ILocalizedText;
    caption?: ILocalizedText;
}