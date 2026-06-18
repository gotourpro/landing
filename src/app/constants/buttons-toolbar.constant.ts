
import { MenuItem } from "primeng/api";

export const ToolBarButtonsMenu: MenuItem[] = [
   {
        id: 'map',
        disabled: false,
        label: 'Карта',
        icon: 'pi pi-map',
        visible: true,
        command: (event?: any) => {
            if (event && event.context) {
                event.context.onShowMap();
            }
        }

    },
];