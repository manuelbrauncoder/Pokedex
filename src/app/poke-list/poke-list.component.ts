import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PokeDetailsComponent } from '../poke-details/poke-details.component';
import { ZeroPadPipe } from '../pipes/zero-pad.pipe';
import { FormsModule } from '@angular/forms';
import { BreakpointObserverService } from '../services/breakpoint-observer.service';

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PokeDetailsComponent, ZeroPadPipe, FormsModule],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss',
})
export class PokeListComponent implements OnInit {
  public apiService = inject(ApiService);
  public observerService = inject(BreakpointObserverService);

  detailboxShown: boolean = false;

  /**
   * reset filter and clear input, show all pokemon
   */
  goBack(){
    this.apiService.displayedPokemon = this.apiService.allPokemon;
    this.apiService.searchInput = '';
    this.apiService.currentTypeFilter = 'all';
  }

  /**
   * change if detail box is visible or not
   * @param state 
   */
  changeDetailViewState(state: boolean){
    this.detailboxShown = state;
  }

  /**
   * toggle detailbox
   * @param index 
   */
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
