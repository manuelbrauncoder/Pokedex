import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { BreakpointObserverService } from '../../services/breakpoint-observer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public apiService = inject(ApiService);
  public observerService = inject(BreakpointObserverService);
  private elementRef = inject(ElementRef);
  public router = inject(Router);

  dropdownShown: boolean = false;

  ngOnInit(): void {
    this.observerService.observeTablet();
    this.observerService.observeHandsetPortrait();
  }

  /**
   * close dropdown menu, when clicking outside
   * @param event 
   * @returns 
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.observerService.menuIsShown()) {
      return;
    } else {
      const insideDropdown = this.elementRef.nativeElement
        .querySelector('.customSelect')
        .contains(event.target);
      if (!insideDropdown && this.dropdownShown) {
        this.dropdownShown = false;
      }
    }
  }

  /**
   * toggle dropdown menu
   */
  toggleDropDown() {
    this.dropdownShown = !this.dropdownShown;
  }

  /**
   * toggle menu
   */
  toggleMenu() {
    this.observerService.showMenu = !this.observerService.showMenu;
  }

  /**
   * change pokemon type filter
   * @param type 
   */
  changeTypeFilter(type: string) {
    this.checkRoute();
    setTimeout(() => {
      this.apiService.currentTypeFilter = type;
      this.apiService.filterByType();
    }, 50);
  }

  /**
   * calling on input, search pokemon
   */
  search() {
    this.checkRoute();
    setTimeout(() => {
      this.apiService.currentTypeFilter = 'all';
      this.apiService.resetSearch();
      this.apiService.filterPokemon(this.apiService.searchInput);
    }, 50);
  }

  /**
   * back to root if not on root route
   */
  checkRoute() {
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
