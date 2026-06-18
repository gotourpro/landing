import { ILocalizedText } from "../../../interfaces/localized-text.interface";
import { IDestinationQuestion } from "./destination-question.interface";


export interface IDestination {
    id: string;
    slug: string;

    title: ILocalizedText;
    description?: ILocalizedText;

    titleHeader?: ILocalizedText;
    destinationHeader?: ILocalizedText;

    country?: ILocalizedText;
    city?: ILocalizedText;

    coordinates: [number, number];

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