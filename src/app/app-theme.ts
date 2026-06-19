import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const Noir = definePreset(Aura, {
    components: {
        inputnumber: {
            button: {
                width: '3rem'
            }
        },
        dropdown: {
            background: 'transparent'
        },
        autocomplete:
            { dropdown: { background: 'red' } },
        message: {
            error:
            {
                color: '#f87171',
                simple: {
                    color: '#f87171',
                }
            }
        },
        multiselect: {
            chip: {
                border: {
                    radius: '16px'
                }
            }
        },

        toggleswitch: {
            height: '1.75rem',
            width: '3rem',
            handle: {
                size: '1.25rem'
            }
        },
        treeselect: {
            chip: {
                border: {
                    radius: '16px'
                }
            },
            tree: {
                padding: '0.5rem'
            }
        }
    },
    semantic: {
        // Новая палитра на основе базового цвета #1BBC9B (Teal/Mint)
        primary: {
            "50": "#e4f8f4",
            "100": "#c1efe5",
            "200": "#96e3d3",
            "300": "#63d3bf",
            "400": "#3dc4aa",
            "500": "#1bbc9b", // Ваш базовый цвет
            "600": "#169b80",
            "700": "#117a65",
            "800": "#0d5e4e",
            "900": "#094237",
            "950": "#04221c"
        },
        // Дополнительная палитра на основе #F8931F (Orange/Amber) для кастомного использования
        secondary: {
            "50": "#fff4e6",
            "100": "#ffe3c2",
            "200": "#ffce94",
            "300": "#ffaf5e",
            "400": "#f99c38",
            "500": "#f8931f", // Ваш второй цвет
            "600": "#d67711",
            "700": "#b05f0b",
            "800": "#8a4708",
            "900": "#633104",
            "950": "#3d1b01"
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#117a65', // Изменено под тон primary.700
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617'
                },
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',   // Плавное потемнение при наведении
                    activeColor: '{primary.700}'   // Более темный тон при клике
                },
                highlight: {
                    background: '{primary.50}',     // Нежно-зеленый фон выделения
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',        // Читаемый текст на светлом фоне
                    focusColor: '{primary.800}'
                }
            },
            dark: {
                surface: {
                    0: "#ffffff",
                    50: "{slate.50}",
                    100: "{slate.100}",
                    200: "{slate.200}",
                    300: "{slate.300}",
                    400: "{slate.400}",
                    500: "{slate.500}",
                    600: "{slate.600}",
                    700: "{slate.700}",
                    800: "{slate.800}",
                    900: "{slate.900}",
                    950: "{slate.950}",
                },
                primary: {
                    color: '{primary.400}',        // В темной теме лучше смотрится чуть более яркий 400
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.300}',   // Высветление при наведении в темной теме
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                    focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        },
        formField: {
            paddingX: "0.75rem",
            paddingY: "0.75rem",
            sm: {
                fontSize: "0.875rem",
                paddingX: "0.625rem",
                paddingY: "0.375rem"
            },
            lg: {
                fontSize: "1.125rem",
                paddingX: "0.875rem",
                paddingY: "0.625rem"
            },
            borderRadius: "{border.radius.md}",
            focusRing: {
                width: "1px",                  // Добавлен тонкий бордер при фокусе
                style: "solid",
                color: "{primary.500}",        // Кольцо фокуса теперь брендового цвета
                offset: "0",
                shadow: "none"
            },
            transitionDuration: "{transition.duration}"
        },
        navigation: {
            list: {
                padding: "0.25rem 0.25rem",
                gap: "2px"
            },
            item: {
                padding: "0.75rem 0.75rem",
                borderRadius: "{border.radius.sm}",
                gap: "0.5rem"
            },
            submenuLabel: {
                padding: "0.5rem 0.75rem",
                fontWeight: "600"
            },
            submenuIcon: {
                size: "0.875rem"
            }
        },
        list: {
            padding: "0.25rem 0.25rem",
            gap: "2px",
            header: {
                padding: "0.5rem 1rem 0.25rem 1rem"
            },
            option: {
                padding: "0.75rem 0.75rem",
                borderRadius: "{border.radius.sm}"
            },
            optionGroup: {
                padding: "0.75rem 0.75rem",
                fontWeight: "600"
            }
        },
    }

});