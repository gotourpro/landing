import {
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef
  } from '@angular/core';
  
  @Directive({
    selector: '[appFilterTemplate]',
    standalone: true
  })
  export class FilterTemplateDirective {
    @Input('appFilterTemplate') type!: 'text' | 'date' | 'autocomplete';
    @Input() col!: any;
    @Input() filterCallback!: (value: any) => void;
    @Input() columnFilter!: any;
  
    @Input() textFilterTemplate!: TemplateRef<any>;
    @Input() dateFilterTemplate!: TemplateRef<any>;
    @Input() autoCompleteFilterTemplate!: TemplateRef<any>;
  
    constructor(private viewContainerRef: ViewContainerRef) {}
  
    ngOnInit() {
      let selectedTemplate: TemplateRef<any> | null = null;
  
      switch (this.type) {
        case 'text':
          selectedTemplate = this.textFilterTemplate;
          break;
        case 'date':
          selectedTemplate = this.dateFilterTemplate;
          break;
        case 'autocomplete':
          selectedTemplate = this.autoCompleteFilterTemplate;
          break;
      }
  
      if (selectedTemplate) {
        this.viewContainerRef.createEmbeddedView(selectedTemplate, {
          $implicit: null,
          filterCallback: this.filterCallback,
          col: this.col,
          columnFilter: this.columnFilter
        });
      }
    }
  }
  