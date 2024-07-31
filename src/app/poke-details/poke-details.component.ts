import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ZeroPadPipe } from '../pipes/zero-pad.pipe';
import { AboutComponent } from '../detailSection/about/about.component';
import { EvoComponent } from '../detailSection/evo/evo.component';
import { MovesComponent } from '../detailSection/moves/moves.component';
import { StatsComponent } from '../detailSection/stats/stats.component';
import { PokemonDetails } from '../interfaces/types';

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
    CommonModule,
  ],
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.scss',
})
export class PokeDetailsComponent implements OnInit, OnDestroy {
  public apiService = inject(ApiService);
  @Output() showDetailView = new EventEmitter<boolean>();

  currentPokemon: PokemonDetails = this.apiService.pokeDetailWithIndex();

  speciesUrl: string = '';

  activeSection: 'about' | 'stats' | 'evo' | 'moves' = 'about';

  async ngOnInit(): Promise<void> {
    await this.refreshPokemonDetails();
  }

  async refreshPokemonDetails() {
    this.activeSection = 'about';
    this.speciesUrl = this.currentPokemon.species.url;
    this.setDataForChart();
    await this.apiService.getSpecies(this.speciesUrl);
    await this.apiService.getEvochain(this.apiService.evoUrl);
  }

  ngOnDestroy(): void {
    this.apiService.chartData = [];
    this.apiService.chartLabels = [];
  }

  async nextPokemon() {
    this.apiService.chartData = [];
    this.apiService.chartLabels = [];
    this.apiService.selectedIndexForDetails++;
    this.currentPokemon = this.apiService.pokeDetailWithIndex();
    await this.refreshPokemonDetails();
    console.log(this.apiService.selectedIndexForDetails);
  }

  /**
   * set Data for chart with current pokemon
   */
  setDataForChart() {
    this.currentPokemon.stats.forEach((stat) => {
      let name = this.capitalizeFirstLetter(stat.stat.name);
      this.apiService.chartLabels.push(name);
      this.apiService.chartData.push(stat.base_stat);
    });
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
