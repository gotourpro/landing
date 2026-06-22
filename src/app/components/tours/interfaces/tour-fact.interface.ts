import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface ITourFact {
    icon?: string;
    title: ILocalizedText;
    value: ILocalizedText;
}