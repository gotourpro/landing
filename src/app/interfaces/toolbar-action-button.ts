export interface IToolbarActionButton {
    name: string;
    tooltipText?: string;
    icon: string;
    isSvgIcon?: boolean;
    isSimpleButton?: boolean;
    simpleButtonText?: string;
    cssClass?: string;
    disabled?: boolean;
    badge?:number;
    visible?: boolean;
    children?: IToolbarActionButton[];
    action?(...params: any[]): void;
  }
  