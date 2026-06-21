import { ILocalizedText } from "./localized-text.interface";

export interface ILocalizedMeta {
    title: ILocalizedText;
    description: ILocalizedText;
    keywords?: ILocalizedText;
}