import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserverService } from '../services/breakpoint-observer.service';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  private router = inject(Router);
  public observerService = inject(BreakpointObserverService);

  goBack(){
    this.router.navigate(['/']);
    setTimeout(() => {
      window.scrollTo({top: 0});
    }, 50);
  }
}
