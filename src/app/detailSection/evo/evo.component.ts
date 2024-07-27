import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Root } from '../../interfaces/types';
import { EvolutionChainDetails } from '../../interfaces/chain';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evo.component.html',
  styleUrl: './evo.component.scss'
})
export class EvoComponent implements OnInit {
  apiService = inject(ApiService);
  currentPokemon: Root = this.apiService.pokeDetailWithIndex();
  currentChain: EvolutionChainDetails = this.apiService.currentEvoChain[0];


  async ngOnInit(): Promise<void> {
   
   
  }
}
