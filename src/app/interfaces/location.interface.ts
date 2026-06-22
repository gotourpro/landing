import { ILocalizedText } from "./localized-text.interface";

export interface ITourLocation {
    name: ILocalizedText;
    coordinates?: [number, number];
}