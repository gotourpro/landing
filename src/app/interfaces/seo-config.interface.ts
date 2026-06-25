export interface ISeoConfig {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    lang?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;

}