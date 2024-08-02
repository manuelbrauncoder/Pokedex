import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { NoLandscapeComponent } from './no-landscape/no-landscape.component';
import { BreakpointObserverService } from './services/breakpoint-observer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaincontentComponent, FooterComponent, HeaderComponent, NoLandscapeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  title = 'pokedex';
  observerService = inject(BreakpointObserverService);

  
  constructor() {}

ngOnInit(): void {
  this.observerService.observeHandsetLandscape();
}

 
}
