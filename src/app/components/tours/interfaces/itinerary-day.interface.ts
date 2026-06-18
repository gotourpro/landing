import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface IItineraryDay {
    day: number;
    title: ILocalizedText;
    description?: ILocalizedText;
}