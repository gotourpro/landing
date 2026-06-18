import { SortMeta } from "primeng/api";
export class QueryBase {

  public take?: number;
  public skip?: number;
  public sort?: any[] | Partial<SortMeta>;
  public companyId?:string;

  constructor(obj?: Partial<QueryBase>) {
    (<any>Object).assign(this, obj);
  }

}

export class Query<TFilter> extends QueryBase {

  public filter?: TFilter;

  constructor(obj: Partial<Query<any>>) {
    super();
    (<any>Object).assign(this, obj);
  }

}
