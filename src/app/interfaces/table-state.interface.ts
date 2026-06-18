import { Table } from "primeng/table";

export  interface ITableState {
    activeColumns: any[];   
    allColumns: any[];         
    tableOptions: Partial<Table>; 
  }