import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private timeoutSubscription?: Subscription;
  private isWatching = false; 

  constructor(private idle: Idle, private authService: AuthService, private router: Router) {}

  public startWatching() {
    if (this.isWatching) return;
    this.isWatching = true;

    this.idle.setIdle(60);
    this.idle.setTimeout(60);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.timeoutSubscription = this.idle.onTimeout.subscribe(() => {
      console.log('User has been idle too long, logging out...');
      this.authService.logout();
    });

    this.idle.watch();
  }

  public stopWatching() {
    if (!this.isWatching) return;
    this.isWatching = false;

    this.idle.stop();
    this.timeoutSubscription?.unsubscribe(); 
  }
}