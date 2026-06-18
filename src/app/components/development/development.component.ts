import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// external libs
import { Subject } from 'rxjs';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
// external libs
@Component({
    selector: 'app-development',
    templateUrl: './development.component.html',
    styleUrl: './development.component.scss',
    imports: [CommonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevelopmentComponent implements OnInit, OnDestroy {

    public toolTipText: string;
    public title: string;

    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _router: Router,
    ) { }

    public ngOnInit(): void {
        this.toolTipText = 'Go to dashboard';
        this.title = 'In development';
    }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    public onGoHome(): void {
        this._router.navigate(['/']);
    }

}
