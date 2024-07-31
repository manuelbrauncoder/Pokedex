import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PokemonDetails } from '../../interfaces/types';

@Component({
  selector: 'app-moves',
  standalone: true,
  imports: [],
  templateUrl: './moves.component.html',
  styleUrl: './moves.component.scss'
})
export class MovesComponent {
  apiService = inject(ApiService);
  currentPokemon: PokemonDetails = this.apiService.pokeDetailWithIndex();

}
