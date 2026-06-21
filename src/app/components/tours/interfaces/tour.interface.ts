import { ILocalizedText } from "../../../interfaces/localized-text.interface";
import { IDailyScheduleItem } from "./daily-schedule-Item.interface";
import { IItineraryDay } from "./itinerary-day.interface";
import { ITourQuestion } from "./tour-questions.interface";

export interface ITour {

    id: string;
    slug: string;
    title: ILocalizedText;
    description?: ILocalizedText;
    titleHeader?: ILocalizedText;
    tourHeader?: ILocalizedText;
    destinationSlug?: string;
    country?: ILocalizedText;
    tags?: string[];
    included?: ILocalizedText[];
    excluded?: ILocalizedText[];
    city?: ILocalizedText;
    coordinates?: [number, number];
    categorySlug?: string;
    image: string;
    images?: string[];
    video?: string;
    videoThumb?: string;
    price?: number;
    oldPrice?: number;
    currency?: string;
    durationDays?: number;
    durationNights?: number;
    rating?: number;
    reviews?: number;
    views?: number;
    featured?: boolean;
    popular?: boolean;
    content?: ILocalizedText;
    contentSecond?: ILocalizedText;
    questions?: ITourQuestion[];
    itinerary?: IItineraryDay[];
    dailySchedule?: IDailyScheduleItem[];
    createdAt?: string;
    highlights?: ILocalizedText[];
    minGroupSize?: number;
    maxGroupSize?: number;
}


