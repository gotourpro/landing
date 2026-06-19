import { ILegalSection } from "./legal-section.interface";

export interface ILegalDocument {
    lastUpdated: string;
    sections: ILegalSection[];
}