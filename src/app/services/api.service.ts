import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon';
import { PokemonDetails } from '../interfaces/pokemon-details';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private pokeListUrl =
    'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';

  pokeList: Pokemon[] = [];
  pokeDetails: PokemonDetails[] = [];
  numberToFetch: number = 25;
  selectedIndexForDetails: number = 0;


  constructor(private http: HttpClient) {}

  fetchPokeList(): Observable<{ results: Pokemon[] }> {
    return this.http.get<{ results: Pokemon[] }>(this.pokeListUrl);
  }

  fetchPokeDetails(url: string): Observable<PokemonDetails> {
    return this.http.get<any>(url);
  }

  async loadPokeDetails() {
    for (let i = 0; i < this.numberToFetch; i++) {
      await this.getPokeDetails(i);
    }
  }

  async getPokeList(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchPokeList().subscribe({
        next: (list) => {
          this.pokeList = list.results;
          resolve();
        },
        error: (err) => {
          console.log('Error fetchting List Data', err);
          reject(err);
        },
        complete: () => {
          //console.log('Fetching Pokemon List complete');
        },
      });
    });
  }

  async getPokeDetails(index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.pokeList[index].url;
      this.fetchPokeDetails(url).subscribe({
        next: (details) => {
          this.pokeDetails.push(
            this.getPokeDetailObject(
              details.name,
              details.sprites.front_default
            )
          );
          //console.log(this.pokeDetails);
          resolve();
        },
        error: (err) => {
          console.log('Error fetching Pokemon Details', err);
          reject(err);
        },
        complete: () => {
          //console.log('Fetching Pokemon Details complete');
        },
      });
    });
  }

  getPokeDetailObject(name: string, img: string): PokemonDetails {
    return {
      name: name,
      sprites: {
        front_default: img,
      },
    };
  }
}
