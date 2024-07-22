import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PokeDetailsComponent } from '../poke-details/poke-details.component';
import { ZeroPadPipe } from '../pipes/zero-pad.pipe';

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PokeDetailsComponent, ZeroPadPipe],
  templateUrl: './poke-list.component.html',
  styleUrl: './poke-list.component.scss',
})
export class PokeListComponent implements OnInit {
  public apiService = inject(ApiService);

  detailboxShown: boolean = false;

  changeDetailViewState(state: boolean){
    this.detailboxShown = state;
  }

  showDetailBox(index: number) {
    this.detailboxShown = !this.detailboxShown;
    this.apiService.selectedIndexForDetails = index;
  }

  async ngOnInit(): Promise<void> {
    await this.apiService.getPokeList();
    await this.apiService.loadPokeDetails(this.apiService.pokeList, this.apiService.pokeDetails);
  }
}
