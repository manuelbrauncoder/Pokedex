import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Root } from '../../interfaces/types';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
public apiService = inject(ApiService);

currentPokemon: Root = this.apiService.pokeDetailWithIndex();
}
