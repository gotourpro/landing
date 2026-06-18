
import { ObjectUtils } from 'primeng/utils';
import { UserRole } from '../constants/user-role.constant';

export class Utils {


  public static deepCopy<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
  }

  public static withoutRoles<T extends { label: string; value: string }>(
    roles: T[],
    toRemove: readonly string[]
  ): T[] {
    const removeSet = new Set(toRemove);
    return roles.filter(role => !removeSet.has(role.value.trim()));
  }

  public static filterItems(query: any, data: any) {
    let filtered: any[] = [];
    for (let i = 0; i < (data as any[]).length; i++) {
      let item = (data as any[])[i];
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(item);
      }
    }
    return filtered;
  }

  public static isArrayEmpty(array) {
    return Array.isArray(array) && array.length === 0;
  }

  public static getExportHeader(column: any, exportHeader = 'header') {
    return column[<string>exportHeader] || column.header || column.field;
  }


  public static exportDataTable(data, columns) {

    const exportableColumns: any[] = (<any[]>columns).filter((column) => column.exportable !== false && column.field);

    const body = data
      .map((record: any) =>
        exportableColumns
          .map((column) => {
            let cellData = ObjectUtils.resolveFieldData(record, column.field);
            if (cellData != null) {
              cellData = {
                data: cellData,
                field: this.getExportHeader(column)
              };
            };
            return cellData;
          })
      );

    return body;
  }

}
