import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreakpointsService {
  static readonly Breakpoints = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  };

  readonly sm$: Observable<boolean>;
  readonly md$: Observable<boolean>;
  readonly lg$: Observable<boolean>;
  readonly xl$: Observable<boolean>;
  readonly xl2$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.sm$ = this.observe(BreakpointsService.Breakpoints.sm);
    this.md$ = this.observe(BreakpointsService.Breakpoints.md);
    this.lg$ = this.observe(BreakpointsService.Breakpoints.lg);
    this.xl$ = this.observe(BreakpointsService.Breakpoints.xl);
    this.xl2$ = this.observe(BreakpointsService.Breakpoints['2xl']);
  }

  public observe(query: string): Observable<boolean> {
    return this.breakpointObserver.observe(query).pipe(
      map((state: BreakpointState) => state.matches),
      shareReplay(1)
    );
  }

  public observeMultiple(queries: string[]): Observable<BreakpointState> {
    return this.breakpointObserver.observe(queries).pipe(shareReplay(1));
  }
}
