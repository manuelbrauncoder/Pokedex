import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PokeDetailsComponent } from '../poke-details/poke-details.component';
import { ZeroPadPipe } from '../pipes/zero-pad.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PokeDetailsComponent, ZeroPadPipe, FormsModule],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss',
})
export class PokeListComponent implements OnInit {
  public apiService = inject(ApiService);

  detailboxShown: boolean = false;

  goBack(){
    this.apiService.displayedPokemon = this.apiService.allPokemon;
    this.apiService.searchInput = '';
    this.apiService.currentTypeFilter = 'all';
  }

  changeDetailViewState(state: boolean){
    this.detailboxShown = state;
  }

  showDetailBox(index: number) {
    this.detailboxShown = !this.detailboxShown;
    this.apiService.selectedIndexForDetails = index;
  }

  async ngOnInit(): Promise<void> {
    this.apiService.isLoading = true;
    await this.apiService.prepareUrlToFetch();
    this.apiService.isLoading = false;
    this.apiService.displayedPokemon = this.apiService.allPokemon;
    await this.apiService.getCompleteList();
    this.apiService.getTypesForFilter();   
  }
}
