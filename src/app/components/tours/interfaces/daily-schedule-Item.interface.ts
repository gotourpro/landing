import { ILocalizedText } from "../../../interfaces/localized-text.interface";

export interface IDailyScheduleItem {
    time: string;
    title: ILocalizedText;
    description: ILocalizedText;
}