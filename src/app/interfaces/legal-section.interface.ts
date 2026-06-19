import { ILocalizedText } from "./localized-text.interface";

export interface ILegalSection {
    id: string;
    title: string;
    content: string[];
    items?: {
        title: string;
        content: string[];
    }[];
}