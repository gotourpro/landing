import { ILocalizedText } from "../../../interfaces/localized-text.interface";
import { ITourLocation } from "../../../interfaces/location.interface";
import { ITourFact } from "../../tours/interfaces/tour-fact.interface";
import { DestinationType } from "../types/destination.type";
import { IDestinationQuestion } from "./destination-question.interface";


export interface IDestination {
    id: string;
    slug: string;
    title: ILocalizedText;
    type?: DestinationType;
    description?: ILocalizedText;
    titleHeader?: ILocalizedText;
    destinationHeader?: ILocalizedText;
    seoTitle?: ILocalizedText;
    seoDescription?: ILocalizedText;
    seoKeywords?: ILocalizedText[];
    facts?: ITourFact[];
    tags?: ILocalizedText[];
    locations?: ITourLocation[];
    country?: ILocalizedText;
    city?: ILocalizedText;
    region?: ILocalizedText;
    coordinates: [number, number];
    highlights?: ILocalizedText[];
    image: string;
    images?: string[];
    video?: string;
    videoThumb?: string;
    listings?: number;
    rating?: number;
    views?: number;
    featured?: boolean;
    popular?: boolean;
    address?: ILocalizedText;
    language?: ILocalizedText;
    currency?: ILocalizedText;
    distance?: ILocalizedText;
    content?: ILocalizedText;
    contentSecond?: ILocalizedText;
    questions?: IDestinationQuestion[];
    createdAt?: string;
}