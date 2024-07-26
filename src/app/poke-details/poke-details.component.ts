import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ZeroPadPipe } from '../pipes/zero-pad.pipe';
import { PokemonTypes } from '../interfaces/pokemon-types';

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [CommonModule, ZeroPadPipe],
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.scss',
})
export class PokeDetailsComponent {
  public apiService = inject(ApiService);
  @Output() showDetailView = new EventEmitter<boolean>();

  toggleDetailView() {
    this.showDetailView.emit(false);
  }

  
}
