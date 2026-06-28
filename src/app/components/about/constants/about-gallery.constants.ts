export interface IAboutGalleryColumn {
    type: 'large' | 'small';
    items: {
        image: string;
    }[];
}

export const ABOUT_GALLERY_COLUMNS: IAboutGalleryColumn[] = [
    {
        type: 'large',
        items: [
            {
                image: 'tours/dali/11'
            }
        ]
    },
    {
        type: 'small',
        items: [
            {
                image: 'tours/dali/3'
            },
            {
                image: 'tours/sanya/16'
            }
        ]
    },
    {
        type: 'large',
        items: [
            {
                image: 'tours/sanya/12'
            }
        ]
    },
    {
        type: 'small',
        items: [
            {
                image: 'tours/chengdu/13'
            },
            {
                image: 'tours/shenzhen/10'
            }
        ]
    },
    {
        type: 'large',
        items: [
            {
                image: 'tours/beijing/8'
            }
        ]
    }
];