import { Component, OnInit } from '@angular/core';
import { DateTimePipe } from '../../pipes/date-time.pipe';
import { interval, map, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-date-time',
    standalone: true,
    templateUrl: './date-time.component.html',
    styleUrls: ['./date-time.component.scss'],
    imports: [CommonModule,DateTimePipe]
})
export class DateTimeComponent implements OnInit {

    public currentDate$ = interval(1000).pipe(
        startWith(0),
        map(() => new Date())
    );


    public ngOnInit(): void {
    }
}