import { MenuItem } from "primeng/api";

export const TableExportMenuItems: MenuItem[] = [
    {
        label: 'Export exel',
        icon: 'pi pi-file-export',
        id:'exel',
        command: (event?: any) => {
            if (event && event.context) {
                event.context.exportExcel();
            }
        }
    },
    {
        label: 'Export pdf',
        id:'pdf',
        icon: 'pi pi-file-export',
        command: (event?: any) => {
            if (event && event.context) {
                event.context.exportPdf();
            }
        }
    },

    {
        label: 'Export csv',
        id:'csv',
        icon: 'pi pi-file-export',
        command: (event?: any) => {
            if (event && event.context) {
                event.context.exportCSV();
            }
        }
    }
];