import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [],
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
