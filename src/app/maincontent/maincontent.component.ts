import { Component, inject } from '@angular/core';
import { PokeListComponent } from '../poke-list/poke-list.component';
import { ApiService } from '../services/api.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-maincontent',
  standalone: true,
  imports: [PokeListComponent, LoadingSpinnerComponent],
  templateUrl: './maincontent.component.html',
  styleUrl: './maincontent.component.scss'
})
export class MaincontentComponent {
  public apiService = inject(ApiService);

}
