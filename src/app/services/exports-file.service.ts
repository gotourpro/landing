import { Injectable } from '@angular/core';
import { FontDocument } from '../constants/font-document.constant';
import { LogoPdf } from '../constants/logo-pdf.constant';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

@Injectable({
    providedIn: 'root'
})
export class ExportsFileService {

    constructor() {
        const f = FontDocument
    }


    public exportToExcel(data: any, fileName: string): void {
        if (!data || !Array.isArray(data)) {
          console.error("Invalid dataRow format");
          return;
        }
    
        // Преобразуем в плоский массив объектов
        const flatData = data.map((row: any[]) => {
          const flatRow: any = {};
          row.forEach(item => {
            if (item && item.field && item.data !== undefined) {
              flatRow[item.field] = item.data;
            }
          });
          return flatRow;
        });
    
        // Создаём книгу и лист
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('dataRow');
    
        // Устанавливаем заголовки
        const headers = Object.keys(flatData[0] || {}).map(key => ({
          header: key,
          key: key,
          width: 20,
        }));
    
        worksheet.columns = headers;
    
        // Добавляем строки
        flatData.forEach(row => {
          worksheet.addRow(row);
        });
    
        // Генерация и сохранение файла
        workbook.xlsx.writeBuffer().then(buffer => {
          const blob = new Blob(
            [buffer],
            {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
          );
          FileSaver.saveAs(blob, `${fileName}.xlsx`);
        });
      }

    public exportToPdf(data: any, fileName: string, logoBase64?: string): void {
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.error("Invalid or empty dataRow");
            return;
        }

        const columns = data[0]
            .filter((item: any) => item && item.field)
            .map((item: any) => item.field);

        const body = data.map((row: any[]) =>
            columns.map((col: string) => {
                const cell = row.find((item: any) => item && item.field === col);
                return cell ? cell.data : "";
            })
        );

        const document = new jsPDF('l', 'pt');
        document.addFileToVFS("Amiri-Regular.ttf", FontDocument);
        document.addFont("Amiri-Regular.ttf", "Amiri", "normal");
        document.setFont("Amiri");


        if (LogoPdf && LogoPdf.startsWith("data:image/png;base64,")) {
            const x = 20,
                y = 20,
                width = 120,
                height = 34;
            document.addImage(LogoPdf, "PNG", x, y, width, height);
        } else {
            console.warn("Invalid or missing logoBase64 string");
        }

        autoTable(document, {
            head: [columns],
            body: body,
            styles: {
                font: 'Amiri',
                fontStyle: 'normal',
            },
            headStyles: {
                fillColor: [24, 99, 204],
                textColor: [255, 255, 255],
                fontSize: 12,
                halign: 'center',
            },
            margin: { top: 80 },
        });

        document.save(`${fileName}.pdf`);
    }

    private _saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}