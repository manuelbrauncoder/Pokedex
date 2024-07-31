import { Component, inject, Input } from '@angular/core';
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
  initialPokemon: PokemonDetails = this.apiService.pokeDetailWithIndex();

  @Input()pokemon: PokemonDetails = this.initialPokemon;

}
