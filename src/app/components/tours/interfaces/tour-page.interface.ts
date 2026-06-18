import { ITour } from "./tour.interface";

export interface ITourPage {
    items: ITour[];
    total: number;
    hasMore: boolean;
}