import { IBlogPost } from "./blog-post.interface";

export interface IBlogPage {
    items: IBlogPost[];
    total: number;
    hasMore: boolean;
}