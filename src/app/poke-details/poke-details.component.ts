import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
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
export class PokeDetailsComponent implements OnInit, OnDestroy {
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
    this.setDataForChart();
  }

  ngOnDestroy(): void {
    this.apiService.chartData = [];
    this.apiService.chartLabels = [];
  }

  /**
   * set Data for chart with current pokemon
   */
  setDataForChart(){
    this.currentPokemon.stats.forEach((stat) => {
      let name = this.capitalizeFirstLetter(stat.stat.name);
      this.apiService.chartLabels.push(name);
      this.apiService.chartData.push(stat.base_stat);
    })
  }

  /**
   * 
   * @param input string to capitalize
   * @returns capitalized string
   */
  capitalizeFirstLetter(input: string): string {
    let letter = input.charAt(0);
    let uppercaseLetter = letter.toUpperCase();
    let restWord = input.slice(1);
    let capString = uppercaseLetter + restWord;
    return capString;
  }

  /**
   * set active section
   * @param section 
   */
  setActiveSection(section: 'about' | 'stats' | 'evo' | 'moves') {
    this.activeSection = section;
  }

  /**
   * toggle detail view
   */
  toggleDetailView() {
    this.showDetailView.emit(false);
  }
}
