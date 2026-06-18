import { MenuItem } from "primeng/api";

export const TableContextMenu: MenuItem[] = [
    {
        label: 'View on map',
        icon: 'pi pi-map',
        id:'map',
        command: (event?: any) => {
            if (event && event.context) {
                event.context.showOnMap();
            }
        }
    },
    {
        label: 'Edit',
        id:'edit',
        icon: 'pi pi-pencil',
        command: (event?: any) => {
            if (event && event.context) {
                event.context.onEdit(event);
            }
        }
    },
    {
        label: 'Delete',
        id:'delete',
        icon: 'pi pi-trash',
        command: (event?: any) => {
            if (event && event.context) {
                event.context.onDelete(event);
            }
        }
    }
];