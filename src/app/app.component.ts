import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NoLandscapeComponent } from './no-landscape/no-landscape.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaincontentComponent, FooterComponent, HeaderComponent, NoLandscapeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  title = 'pokedex';
  responsive = inject(BreakpointObserver);
  isHandsetLandscape: boolean = false;
  constructor() {}

ngOnInit(): void {
  this.responsive.observe(Breakpoints.HandsetLandscape).subscribe(result => {
    if (result.matches) {
      console.log('mobile landscape');
      this.isHandsetLandscape = true;
    } else if (!result.matches) {
      console.log('no landscape');
      this.isHandsetLandscape = false;
    }
  })
}

 
}
