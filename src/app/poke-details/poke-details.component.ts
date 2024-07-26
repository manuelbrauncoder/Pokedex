import {
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ZeroPadPipe } from '../pipes/zero-pad.pipe';
import { AboutComponent } from '../detailSection/about/about.component';
import { EvoComponent } from '../detailSection/evo/evo.component';
import { MovesComponent } from '../detailSection/moves/moves.component';
import { StatsComponent } from '../detailSection/stats/stats.component';

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [CommonModule, ZeroPadPipe, AboutComponent, EvoComponent, MovesComponent, StatsComponent],
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.scss',
})
export class PokeDetailsComponent {
  public apiService = inject(ApiService);
  @Output() showDetailView = new EventEmitter<boolean>();

  activeSection: 'about' | 'stats' | 'evo' | 'moves' = 'about';

  setActiveSection(section: 'about' | 'stats' | 'evo' | 'moves'){
    this.activeSection = section;
  }

  toggleDetailView() {
    this.showDetailView.emit(false);
  }



  
}
