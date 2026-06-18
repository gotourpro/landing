
import { MenuItem } from "primeng/api";

export const ToolBarMenuItems: MenuItem[] = [
    {
        id: 'filter',
        disabled: false,
        label: 'Filter',
        icon: 'pi pi-filter',
        badge: '0',
        visible: true,
        command: (event?: any) => {
            if (event && event.context) {
                event.context.openFilter();
            }
        }
    },
    {
        id: 'settings',
        badge: '1',
        disabled: false,
        label: 'Settings',
        icon: 'pi pi-sliders-h',
        visible: true,
        command: (event?: any) => {
            if (event && event.context) {
                event.context.onTableSettings();
            }
        }

    },
    {
        id: 'export',
        disabled: false,
        label: 'Exports',
        icon: 'pi pi-file-export',
        visible: true,
        command: (event?: any) => {
            if (event && event.context) {
                event.context.exportMenu.toggle(event.pointEvent);
            }
        }

    }
];