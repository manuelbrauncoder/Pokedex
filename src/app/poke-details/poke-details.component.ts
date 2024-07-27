import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ZeroPadPipe } from '../pipes/zero-pad.pipe';
import { AboutComponent } from '../detailSection/about/about.component';
import { EvoComponent } from '../detailSection/evo/evo.component';
import { MovesComponent } from '../detailSection/moves/moves.component';
import { StatsComponent } from '../detailSection/stats/stats.component';
import { Root } from '../interfaces/types';
import { EvolutionChainDetails } from '../interfaces/chain';

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [
    CommonModule,
    ZeroPadPipe,
    AboutComponent,
    EvoComponent,
    MovesComponent,
    StatsComponent,
  ],
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.scss',
})
export class PokeDetailsComponent implements OnInit {
  public apiService = inject(ApiService);
  @Output() showDetailView = new EventEmitter<boolean>();

  currentPokemon: Root = this.apiService.pokeDetailWithIndex();

  speciesUrl: string ='';

  activeSection: 'about' | 'stats' | 'evo' | 'moves' = 'about';

  async ngOnInit(): Promise<void> {
    this.activeSection = 'about';
    this.speciesUrl = this.currentPokemon.species.url;
    await this.apiService.getSpecies(this.speciesUrl);
    await this.apiService.getEvochain(this.apiService.evoUrl);
  }

  setActiveSection(section: 'about' | 'stats' | 'evo' | 'moves') {
    this.activeSection = section;
  }

  toggleDetailView() {
    this.showDetailView.emit(false);
  }
}
