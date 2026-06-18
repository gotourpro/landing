import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface ITeamMember {
    name: ILocalizedText;
    position: ILocalizedText;
    image: string;
    link?: string;
    delay?: number;
    socials?: {
        icon: string;
        url: string;
    }[];
}