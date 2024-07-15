import { Component, inject, Input } from '@angular/core';
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [],
  templateUrl: './poke-details.component.html',
  styleUrl: './poke-details.component.scss',
})
export class PokeDetailsComponent {
  public apiService = inject(ApiService);
}
