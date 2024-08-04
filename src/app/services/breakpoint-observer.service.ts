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

  /**
   * observe Handset Landscape Mode and change boolean to true
   */
  observeHandsetLandscape(){
    this.responsive.observe(Breakpoints.HandsetLandscape).subscribe(result => {
      if (result.matches) {
        this.isHandsetLandscape = true;
      } else if (!result.matches) {
        this.isHandsetLandscape = false;
      }
    });
  }
/**
   * observe Tablet Portrait Mode and change boolean to true
   */
  observeTablet(){
    this.responsive.observe(Breakpoints.TabletPortrait).subscribe(result => {
      if (result.matches) {
        this.isTabletPortrait = true;
      } else if (!result.matches) {
        this.isTabletPortrait = false;
      }
    });
  }
/**
   * observe Handset Portrait Mode and change boolean to true
   */
  observeHandsetPortrait(){
    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe(result => {
      if (result.matches) {
        this.isHandsetPortrait = true;
      } else if (!result.matches) {
        this.isHandsetPortrait = false;        
      }
    });
  }

  /**
   * 
   * @returns the state of the menu
   */
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
