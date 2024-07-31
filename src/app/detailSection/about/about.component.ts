import { Component, inject, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PokemonDetails } from '../../interfaces/types';
import { WeightPipe } from '../../pipes/weight.pipe';
import { HeightPipe } from '../../pipes/height.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [WeightPipe, HeightPipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
public apiService = inject(ApiService);

initialPokemon: PokemonDetails = this.apiService.pokeDetailWithIndex();

@Input()pokemon: PokemonDetails = this.initialPokemon;
}
