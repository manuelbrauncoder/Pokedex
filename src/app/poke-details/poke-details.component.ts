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
import { BreakpointObserverService } from '../services/breakpoint-observer.service';

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
  observerService = inject(BreakpointObserverService);
  public apiService = inject(ApiService);
  @Output() showDetailView = new EventEmitter<boolean>();
  startAnimation: boolean = false;

  currentPokemon: PokemonDetails = this.apiService.pokeDetailWithIndex();

  speciesUrl: string = '';

  activeSection: 'about' | 'stats' | 'evo' | 'moves' = 'about';

  async ngOnInit(): Promise<void> {
    this.observerService.observeHandsetPortrait();
    this.observerService.observeTablet();
    await this.refreshPokemonDetails();
  }

  isMobile(){
    if ((this.observerService.isHandsetPortrait || this.observerService.isTabletPortrait)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * get Details for new pokemon
   */
  async refreshPokemonDetails() {
    this.activeSection = 'about';
    this.speciesUrl = this.currentPokemon.species.url;
    this.setDataForChart();
    await this.apiService.getSpecies(this.speciesUrl);
    await this.apiService.getEvochain(this.apiService.evoUrl);
  }

  /**
   * clear chart data for chart.js
   */
  clearChartData() {
    this.apiService.chartData = [];
    this.apiService.chartLabels = [];
  }

  ngOnDestroy(): void {
    this.clearChartData();
  }

  /**
   * show next pokemon in list
   * @param event 
   */
  async nextPokemon(event: MouseEvent) {
    event.stopPropagation();
    this.clearChartData();
    this.increaseIndex();
    this.currentPokemon = this.apiService.pokeDetailWithIndex();
    await this.refreshPokemonDetails();
  }

  /**
   * increase pokemon index / handle if max index is reached
   */
  increaseIndex() {
    if (
      this.apiService.selectedIndexForDetails ===
      this.apiService.displayedPokemon.length - 1
    ) {
      this.apiService.selectedIndexForDetails = 0;
    } else {
      this.apiService.selectedIndexForDetails++;
    }
  }

  /**
   * show previous Pokemon in list
   * @param event 
   */
  async previousPokemon(event: MouseEvent) {
    event.stopPropagation();
    this.clearChartData();
    this.decreaseIndex();
    this.currentPokemon = this.apiService.pokeDetailWithIndex();
    await this.refreshPokemonDetails();
  }

  /**
   * decrease pokemon index / handle if is index is 0
   */
  decreaseIndex() {
    if (this.apiService.selectedIndexForDetails === 0) {
      this.apiService.selectedIndexForDetails =
        this.apiService.displayedPokemon.length - 1;
    } else {
      this.apiService.selectedIndexForDetails--;
    }
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
   * close detail view
   */
  closeDetailView() {
    this.startAnimation = true;
    setTimeout(() => {
      this.showDetailView.emit(false);
    }, 250);
  }
}
