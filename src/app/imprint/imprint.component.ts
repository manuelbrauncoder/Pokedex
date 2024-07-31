import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaincontentComponent } from '../maincontent/maincontent.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  private router = inject(Router);

  goBack(){
    this.router.navigate(['/']);
    setTimeout(() => {
      window.scrollTo({top: 0});
    }, 50);
  }
}
