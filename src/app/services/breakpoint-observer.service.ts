import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
  private responsive = inject(BreakpointObserver);

  isHandsetLandscape: boolean = false;
  isTabletPortrait: boolean = false;
  isHandsetPortrait: boolean = false;

  showMenu: boolean = false;

  constructor() { }

  observeHandsetLandscape(){
    this.responsive.observe(Breakpoints.HandsetLandscape).subscribe(result => {
      if (result.matches) {
        this.isHandsetLandscape = true;
      } else if (!result.matches) {
        this.isHandsetLandscape = false;
      }
    })
  }

  observeTablet(){
    this.responsive.observe(Breakpoints.TabletPortrait).subscribe(result => {
      if (result.matches) {
        this.isTabletPortrait = true;
        console.log('Tablet Portrai');
        
      } else if (!result.matches) {
        this.isTabletPortrait = false;
        console.log('not Tablet Portrait');
        
      }
    })
  }

  observeHandsetPortrait(){
    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe(result => {
      if (result.matches) {
        this.isHandsetPortrait = true;
        console.log('Handset Portrait');
        
      } else if (!result.matches) {
        this.isHandsetPortrait = false;
        console.log('not Handset Portrait');
        
      }
    })
  }

  menuIsShown(): boolean {
    if (this.showMenu) {
      return true;
    } else if(!(this.isTabletPortrait || this.isHandsetPortrait)){
      return true;      
    } else {
      return false;
    }
  }
}
