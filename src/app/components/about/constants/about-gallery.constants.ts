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
                image: 'assets/images/gallery/gallery-1-1.jpg'
            }
        ]
    },
    {
        type: 'small',
        items: [
            {
                image: 'assets/images/gallery/gallery-1-2.jpg'
            },
            {
                image: 'assets/images/gallery/gallery-1-6.jpg'
            }
        ]
    },
    {
        type: 'large',
        items: [
            {
                image: 'assets/images/gallery/gallery-1-3.jpg'
            }
        ]
    },
    {
        type: 'small',
        items: [
            {
                image: 'assets/images/gallery/gallery-1-4.jpg'
            },
            {
                image: 'assets/images/gallery/gallery-1-7.jpg'
            }
        ]
    },
    {
        type: 'large',
        items: [
            {
                image: 'assets/images/gallery/gallery-1-5.jpg'
            }
        ]
    }
];