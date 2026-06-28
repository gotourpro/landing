import { ITeamMember } from "../interfaces/iteam-member.interface";

export const ABOUT_TEAM_ITEMS: ITeamMember[] = [
    {
        name: {
            en: 'Olga Ma',
            ru: 'Ольга Ма',
            'zh-Hans': '奥尔加·马'
        },
        position: {
            en: 'Travel agent',
            ru: 'Туристический агент',
            'zh-Hans': '旅游顾问'
        },
        image: 'team/1',
        socials: [
            {
                icon: 'pi pi-telegram',
                url: 'https://t.me/Olo_Boro'
            },
            {
                icon: 'pi pi-whatsapp',
                url: 'https://wa.me/79629366377?text=Hello'
            }
        ]
    },
    {
        name: {
            en: 'Wang Quanli',
            ru: 'Ван Цюаньли',
            'zh-Hans': '王全利'
        },
        position: {
            en: 'Doctor of Traditional Chinese Medicine',
            ru: 'Доктор традиционной китайской медицины',
            'zh-Hans': '中医医生'
        },
        image: 'team/2',
        socials: [

        ]
    },
    {
        name: {
            en: 'Ji Yuye',
            ru: 'Цзи Юйе',
            'zh-Hans': '纪玉叶'
        },
        position: {
            en: 'Doctor of Traditional Chinese Medicine',
            ru: 'Доктор традиционной китайской медицины',
            'zh-Hans': '中医医生'
        },
        image: 'team/3',
        socials: [

        ]
    },
];