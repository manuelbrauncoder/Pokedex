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
  offset: number = 0;
  selectedIndexForDetails: number = 0;
  searchedPokemon: PokemonDetails[] = [];

  constructor(private http: HttpClient) {}

  /**
   * load more pokemon with details
   * offset: start for the loop
   * numberToFetch: End for the loop
   */
  async loadMorePokemon() {
    this.searchedPokemon = [];
    this.numberToFetch += 25;
    this.offset += 25;    
    await this.loadPokeDetails();
  }

  /**
   * 
   * @returns a Observable to subscribe
   */
  fetchPokeList(): Observable<{ results: Pokemon[] }> {
    return this.http.get<{ results: Pokemon[] }>(this.pokeListUrl);
  }

  /**
   * 
   * @param url from api for poke details
   * @returns 
   */
  fetchPokeDetails(url: string): Observable<PokemonDetails> {
    return this.http.get<any>(url);
  }

  /**
   * load poke details from offset to numberToFetch
   */
  async loadPokeDetails() {
    for (let i = this.offset; i < this.numberToFetch; i++) {
      await this.getPokeDetails(i);
    }
  }

  /**
   * load poke details for current index
   * @param index 
   * @returns promise with poke details
   */
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

  /**
   * 
   * @returns promise with complete poke list (only name and url)
   */
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

  /**
   * 
   * @param name 
   * @param img 
   * @returns a PokemonDetails Object
   */
  getPokeDetailObject(name: string, img: string): PokemonDetails {
    return {
      name: name,
      sprites: {
        front_default: img,
      },
    };
  }

  searchPokemon(input: string){
    this.searchedPokemon = [];
    let filteredPokemon = this.pokeDetails.filter( pokemon => this.search(pokemon.name.toLowerCase(), input));
    this.searchedPokemon = filteredPokemon;
  }

  search(name: string, input: string){
    return name.includes(input);
  }
}
