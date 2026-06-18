import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { catchError, delay, filter, map, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { CommonModule, DatePipe, NgFor } from "@angular/common";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { ConfirmationService, MessageService, SortMeta } from "primeng/api";
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from "@angular/forms";
import { IsTextOverflowingPipe } from "../../../../../pipes/text-overflowing.pipe";
import { TooltipModule } from "primeng/tooltip";
import { SpeedDialModule } from "primeng/speeddial";
import { TagModule } from "primeng/tag";
import { ToggleButtonModule } from "primeng/togglebutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { SkeletonModule } from "primeng/skeleton";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogDrawerService } from "../../../../dialog-panel/dialog-panel.service";
import { DIALOG_PANEL_DATA } from "../../../../dialog-panel/dialog-panel.tokens";
import { EmailTemplaterService } from "../../services/email-template.service";
import { Query } from "../../../../../models/query.model";
import { UserService } from "../../../../../services/user.service";
import { LoadProgressService } from "../../../../../services/load-progress.service";
import { ToolbarActionsService } from "../../../../../services/toolbar-actions.service";
import { ToolbarSearchService } from "../../../../../services/toolbar-search.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ToolBarMenuItems } from "../../../../../constants/menu-toolbar.constant";
import { TableContextMenu } from "../../../../../constants/menu-items-constant";
import { TableExportMenuItems } from "../../../../../constants/menu-exports.constant";
import { columnsEmailTemplates } from "../../constants/template-columns";
import { PanelAction } from "../../../../../enums/panel-action.enum";
import { EmailTemplateListItem } from "../../models/email-template-list-item";
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableSettingsComponent } from "../../../../table-settings/table-settings.component";

@Component({
    selector: 'app-email-template-list',
    templateUrl: './email-template-list.component.html',
    imports: [CommonModule, IsTextOverflowingPipe,InputIconModule,IconFieldModule,BadgeModule,OverlayBadgeModule, TooltipModule, TableModule, SpeedDialModule, TagModule, ToggleButtonModule, SelectButtonModule, SkeletonModule, FormsModule, ScrollPanelModule, MultiSelectModule, ContextMenuModule, MenuModule, ButtonModule, NgFor, InputGroupModule, InputGroupAddonModule],
    providers: [DialogService, DialogDrawerService, EmailTemplaterService, DatePipe, {
        provide: DIALOG_PANEL_DATA,
        useValue: {},
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmailTemplateListComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('contextMenu') contextMenu: any;
    @ViewChild('exportMenu') exportMenu: any;
    @ViewChild('table') table: Table;

    public storageKeyAllColumns = 'templateAllColumns';
    public storageKeyTable = 'templatetableOptsOrders';
    public storageKeyColumns = 'templateordersColumns';
    public ref: DynamicDialogRef | undefined;
    public toolbarActions: any[];
    public items: MenuItem[] | undefined;
    public isAdmin: boolean;
    public lazyLoadOnInit: boolean;
    public inProgress = true;
    public noProgress: boolean;
    public selectedItem!: any;
    public totalCount: number;
    public sort: any[] | Partial<SortMeta>;
    public statusType: any;
    public exportFilename: string;
    public filter: any;
    public skeletonRows: number[] = [];
    public columns: any[];
    public dataSource!: any;
    public first = 0;
    public totalRecords = 0;
    public rows = 10;
    public tableOptions: Partial<Table>;
    public isMobile = false;
    public isMaximizable = false;
    public page = 0;
    public limit = 0
    public filters = {}
    public multiSortMeta: SortMeta[] = []; 
    private _getDataSource$ = new Subject<Query<any>>();
    private _filter: any | any;
    // private _columnsSelectDialogRef: ColumnsSelectRef;
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    private _tableOptions: Partial<Table> = {
        dataKey: 'id',
        scrollable: true,
        scrollHeight: '650px',
        exportFilename: '',
        showGridlines: false,
        tableStyle: { minWidth: '50rem' },
        lazy: true,
        virtualScroll: false,
        showCurrentPageReport: true,
        paginator: true,
        showLoader: true,
        stateStorage: 'local',
        stateKey: "orderListAdmTable",
        columnResizeMode: 'fit',
        reorderableColumns: true,
        resizableColumns: true,
        size: undefined,
    };


    public exportItems: any[];
    public statusColor: any;

    constructor(
        public dialogService: DialogService,
        private _emailTemplateService: EmailTemplaterService,
        private _cdr: ChangeDetectorRef,
        private _userService: UserService,
        private messageService: MessageService,
        public datePipe: DatePipe,
        private _loadProgressService: LoadProgressService,
        private _dialogDrawerService: DialogDrawerService,
        private _toolbarActionsService: ToolbarActionsService,
        private _toolbarSerachService: ToolbarSearchService,
        private _breakpointObserver: BreakpointObserver,
        private confirmationService: ConfirmationService,
    ) {

        this.toolbarActions = this.mapMenuItems(ToolBarMenuItems, true);
        this.items = this.mapMenuItems(TableContextMenu);
        this.exportItems = this.mapMenuItems(TableExportMenuItems);

       
        this._listenGetDataSource();
        this._listenDataSourse();

        this._watchForBreakpointChanges();

        this._filter = {};

        if (!localStorage?.getItem(this.storageKeyAllColumns)) {
            localStorage.setItem(this.storageKeyAllColumns, JSON.stringify(columnsEmailTemplates));
        }

        if (!localStorage?.getItem(this.storageKeyTable)) {
            localStorage.setItem(this.storageKeyTable, JSON.stringify(this._tableOptions));
        }

        this.exportFilename = `orders_${this.datePipe.transform(Date.now(), 'dd-MM-yyyy H:mm:ss', '', 'ru-RU')}`;
        this._setColumns();
        this._setTableOptions();

    }


    private mapMenuItems(items: any[], addPointEvent: boolean = false, excludedIds: string[] = []): any[] {
        return items
            .filter(item => !excludedIds.includes(item.id))
            .map(item => ({
                ...item,
                command: (event: any) => {
                    item.command && item.command({
                        ...event,
                        context: this,
                        ...(addPointEvent ? { pointEvent: event } : {})
                    });
                }
            }));
    }

    public ngAfterViewInit(): void {
        this._getSettings();
        this.skeletonRows = Array(this.table.rows || this.rows).fill(0);
    }


    onGlobalFilter(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.table.filterGlobal(inputValue, 'contains');
      }

    public ngOnInit(): void {}

    public getSeverity(status: string) {
        return this.statusColor[status];
    }

    public getSeverityValue(status: string) {
        return this.statusType[status];
    }


    public exportCSV(): void {
        this.table.exportCSV();
    }


    public onLazyLoad(event: any): void {
        this.page = event.first / event.rows + 1;
        this.limit = event.rows;
        this.multiSortMeta = event.multiSortMeta
            ? event.multiSortMeta.map(s => ({ field: s.field, order: s.order }))
            : [{ field: 'createdAt', order: -1 }];

        this.filters = event.filters
            ? Object.keys(event.filters).reduce((acc, key) => {
                acc[key] = { value: event.filters[key].value, matchMode: event.filters[key].matchMode };
                return acc;
            }, {})
            : {};
        this._getDataSourceList();
        this._cdr.detectChanges();
    }

    private _fillDataSource(data: any): void {
        this.dataSource = data.data!
        this.totalCount = data.meta.totalItems!;
        this.totalRecords = data.meta.totalItems!;
        this._cdr.detectChanges();
    }

    public contextMenuShow(event: any, data, frozen: boolean, index: number) {
        this.selectedItem = { ...data, frozen, index };
        event.stopPropagation();
        event.preventDefault();
        this.contextMenu.show(event);
    }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
        this._loadProgressService.hide(1);
        this._filter.name = '';
        // (this._columnsSelectDialogRef as any)?.close();
    }

    public trackByFn(index: number): number { return index; }


    public onNotification(status: 'success' | 'error' = 'error'): void {
        const messages = {
            success: {
                summary: 'Успешно',
                detail: 'Данные сохранены'
            },
            error: {
                summary: 'Ошибка',
                detail: 'Произошла ошибка'
            }
        };

        const message = messages[status];

        this.messageService.add({
            severity: status,
            summary: message.summary,
            detail: message.detail
        });
    }

    private _getDialogSettings(): any {
        const storedColumns = localStorage.getItem(this.storageKeyAllColumns);
        const parsedColumns = storedColumns ? JSON.parse(storedColumns) : [];

        return {
            columns: parsedColumns,
            dataForm: {
                selectedColumns: this.columns,
                showGridlines: this.tableOptions?.showGridlines ?? false,
                size: this.tableOptions?.size ?? 'default',
            },
        };
    }

    public onTableSettings(): void {
        const data = this._getDialogSettings();
        const ref: any = this._dialogDrawerService.open(TableSettingsComponent, {
            data: data,
            hasBackdrop: false,
            backdropClass: '',
            panelClass: ''
        });
        ref.afterClosed
            .pipe(
                filter(Boolean),
                tap((data: any) => localStorage.setItem(this.storageKeyColumns, JSON.stringify(data.form.selectedColumns))),
                tap((data: any) => this._initToolbarActions({ badge: data?.badge, name: 'settings' })),
                tap((data) => this.setTablesOptions(data)),
                takeUntil(this._destroy$),
                catchError((error) => { return of(null); })
            ).subscribe();
    }

    public openFilter(): void {
        // const ref: any = this._dialogDrawerService.open(OrderFilterComponent, {
        //     data: { filter: this._filter },
        //     hasBackdrop: false,
        //     backdropClass: '',
        //     panelClass: ''
        // });
        // ref.afterClosed
        //     .pipe(
        //         map((data: any) => data?.action === PanelAction.SAVE ? data : null),
        //         tap((data) => data && this.applyFilterChanges(data)),
        //         catchError((error) => { return of(null); })
        //     ).subscribe();
    }

    private applyFilterChanges(data: any): void {
        this.inProgress = true;
        this.noProgress = false;
        this._cdr.detectChanges();

        this._filter = data.filter;
        this._getDataSourceList();
        this._initToolbarActions({ badge: data?.badge, name: 'filter' });
    }


    public checkFilter(): boolean {
        this._filter as any;
        return !!Object.keys(this._filter).find((value: any) => {
            if (Array.isArray(this._filter[value])) {
                return this._filter[value] && this._filter[value].length;
            }
            return !!this._filter[value];
        });
    }

    private _getSettings(): void {
        this._userService.isAdmin()
            .subscribe((isAdmin: boolean) => {
                this.isAdmin = isAdmin;
                this._getDataSourceList();
                this._initToolbarActions();
                this._initToolbarSearch();
                this._cdr.detectChanges();
            });
    }

    public setTablesOptions(data) {
        const { showGridlines, size } = data?.form || {};
        this._tableOptions.showGridlines = showGridlines;
        this._tableOptions.size = size;
        localStorage.setItem(this.storageKeyTable, JSON.stringify(this._tableOptions));

        this._cdr.detectChanges();
        this._setColumns();
        this._setTableOptions();
        this._cdr.detectChanges();
        this.table?.saveState();
    }
    private _getDataSourceListQuery(): any {
        return {
            params: {
                page: this.page.toString(),
                limit: this.limit.toString(),
                sort: JSON.stringify(this.multiSortMeta), // Send multi-sort array
                filters: JSON.stringify(this.filters), // Send filters
            },
        }
        // const filterRequest = { ...this._filter };
        // return new Query({
        //     take: this.table.rows || this.rows,
        //     skip: this.table.first || this.first,
        //     sort: this.table.multiSortMeta || this.sort,
        //     filter: filterRequest,
        // });
    }

    private _getDataSourceList(): void {
        this._loadProgressService.show(1);
        const body = this._getDataSourceListQuery();
        this._getDataSource$.next(body);
    }

    private _listenDataSourse(): void {
        this._emailTemplateService.templates$
            .pipe(
                delay(200),
                filter(Boolean),
                takeUntil(this._destroy$),
                map((data: any) => {
                    this.totalCount = data.meta.totalItems as any;
                    this.inProgress = false;
                    this._loadProgressService.hide(1);
                    this.noProgress = !data.meta.totalItems;
                    data.data = (data.data ?? []).map(item => this.transformOrderItem(item));
                    return data;
                })
            ).subscribe({
                next: (data: any) => {
                    console
                    this._fillDataSource(data);
                },
                error: (err) => {
                    this.inProgress = false;
                    this._loadProgressService.hide(1);
                }
            });
    }


    private transformOrderItem(item: any): EmailTemplateListItem {
        return new EmailTemplateListItem({
            id: item.id,
            name: item.name || '',
            ...item
        });
    }


    public formatDate(uploadDate: string | null): string {
        if (uploadDate && uploadDate !== '0000-00-00 00:00:00') {
            const formattedDate = this.datePipe.transform(uploadDate, 'shortDate', undefined, 'ru-RU');
            return formattedDate ? formattedDate : '-';
        }
        return '-';
    }

    private _watchForBreakpointChanges(): void {
        this._breakpointObserver.observe(['(max-width: 640px)'])
            .subscribe((state: BreakpointState) => {
                this.isMaximizable = state.matches;
                this._cdr.markForCheck();
            });
    }

    public onSearch(event): void {
        this._filter.name = event;
        if (this.lazyLoadOnInit) {
            this._loadProgressService.show(1);
            this._getDataSourceList();
        }
        this.lazyLoadOnInit = true;
    }

    private _initToolbarSearch(): void {
        // this._toolbarSerachService.search$.next([{
        //     placeholder: 'Поиск',
        //     disabled: false,
        //     tooltipText: 'Поиск',
        //     icon: '',
        //     action: (event) => this.onSearch(event),
        //     visible: true,
        // }]);
    }

    private _initToolbarActions(data?): void {
        const toolbar = this._buildToolbar(data);
        this._toolbarActionsService.actions$.next(toolbar);
    }

    private _buildToolbar(data): any {
        const { badge, name } = data || {};
        if (!badge && !name) return this.toolbarActions;
        return this.toolbarActions = this.toolbarActions?.map((data) => ({ ...data, badge: data.name === name ? badge : data.badge }));
    }

    private _getDisplayedColumns(columns: any[]): any[] {
        return columns?.filter(({ displayed }) => displayed);
    }


    public onDuplicate(): void {
        this._loadProgressService.show(1);
        const { key, id } = this.selectedItem;
        this._emailTemplateService.getById(key)
            .pipe(
                map(({ order }) => {
                    const { id, driver, status, ...rest } = order;
                    return rest;
                }),
                switchMap((data) => this._emailTemplateService.create(data))
            )
            .subscribe((data) => {
                const { status } = data
                this.confirmationService.confirm({
                    key: status,
                    message: `Заказ ${id}, продублирован`,
                    accept: () => {
                    },
                    reject: () => { }
                });
                this._getDataSourceList();
                this._loadProgressService.hide(1);
            });
    }

    public onEdit(): void {
    }


    public onCreate(): void {

    }


    private _listenGetDataSource(): void {
        const source$ = this._getDataSource$
            .pipe(
                switchMap((body) => this._emailTemplateService.paginateAll(body)),
                takeUntil(this._destroy$),
            );

        source$.subscribe();
    }

    private _setColumns(): void {
        const stored = localStorage.getItem(this.storageKeyColumns);
        const columns = (stored && JSON.parse(stored)) ? JSON.parse(stored) : JSON.parse(localStorage.getItem(this.storageKeyAllColumns)!);
        this.columns = this._getDisplayedColumns(columns).sort((a, b) => a.id - b.id);
    }

    private _setTableOptions(): void {
        const stored = localStorage.getItem(this.storageKeyTable);
        const table = (stored && JSON.parse(stored)) ? JSON.parse(stored) : this._tableOptions
        this.tableOptions = table;
        this._cdr.markForCheck();
    }

}