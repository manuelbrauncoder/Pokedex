import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public apiService = inject(ApiService);
  searchInput: string = '';

  search(){
    this.apiService.resetSearch();
    this.apiService.filterPokemon(this.searchInput);
  }
}
