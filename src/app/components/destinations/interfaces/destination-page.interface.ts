import { IDestination } from "./destination.interface";

export interface IDestinationPage {
    items: IDestination[];
    total: number;
    hasMore: boolean;
}