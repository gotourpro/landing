import { ILocalizedText } from "../../../interfaces/localized-text.interface";
import { ITourLocation } from "../../../interfaces/location.interface";
import { IDailyScheduleItem } from "./daily-schedule-Item.interface";
import { IItineraryDay } from "./itinerary-day.interface";
import { ITourFact } from "./tour-fact.interface";
import { ITourQuestion } from "./tour-questions.interface";
import { ITourTreatment } from "./tour-treatment.interface";

export interface ITour {

    id: string;
    slug: string;
    title: ILocalizedText;
    description?: ILocalizedText;
    titleHeader?: ILocalizedText;
    tourHeader?: ILocalizedText;
    seoTitle?: ILocalizedText;
    seoDescription?: ILocalizedText;
    seoKeywords?: ILocalizedText[];
    destinationSlug?: string;
    country?: ILocalizedText;
    tags?: ILocalizedText[];
    facts?: ITourFact[];
    included?: ILocalizedText[];
    excluded?: ILocalizedText[];
    city?: ILocalizedText;
    region?: ILocalizedText;
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
    locations?: ITourLocation[];
    features?: ILocalizedText[];
    treatments?: ITourTreatment[];
    itinerary?: IItineraryDay[];
    dailySchedule?: IDailyScheduleItem[];
    createdAt?: string;
    highlights?: ILocalizedText[];
    minGroupSize?: number;
    maxGroupSize?: number;
}


