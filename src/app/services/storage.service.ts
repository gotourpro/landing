import { Injectable } from '@angular/core';

// external libs
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public setting$ = new BehaviorSubject<any | null>(null);
    public searchOrder$ = new BehaviorSubject<any | null>(null);
    public searchExecutors$ = new BehaviorSubject<any | null>(null);
    public searchCounterparties$ = new BehaviorSubject<any | null>(null);
    public orderFilter$ = new BehaviorSubject<any | null>(null);
    public transportFilter$ = new BehaviorSubject<any | null>(null);
    
    constructor() { }

   
}
