import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public apiService = inject(ApiService);
  private elementRef = inject(ElementRef);

  dropdownShown: boolean = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const insideDropdown = this.elementRef.nativeElement.querySelector('.customSelect').contains(event.target);
    if (!insideDropdown && this.dropdownShown) {
      this.dropdownShown = false;
    }
  }

  toggleDropDown() {
    this.dropdownShown = !this.dropdownShown;
  }

  changeTypeFilter(type: string){
    this.apiService.currentTypeFilter = type;
    this.apiService.filterByType();
  }

  search(){
    this.apiService.currentTypeFilter = 'all';
    this.apiService.resetSearch();
    this.apiService.filterPokemon(this.apiService.searchInput);
  }
}
