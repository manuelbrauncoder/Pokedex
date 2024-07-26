import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonDetails } from '../interfaces/pokemon-details';
import { PokemonTypes } from '../interfaces/pokemon-types';
import { TypeColor } from '../interfaces/type-color';
import { Root } from '../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  displayedPokemon: Root[] = [];

  searchedPokemon: Root[] = [];
  allPokemon: Root[] = [];

  isLoading: boolean = false;

  selectedIndexForDetails: number = 0;

  colors: TypeColor[] = [
    { name: 'normal', color: '#A8A77A' },
    { name: 'fire', color: '#EE8130' },
    { name: 'water', color: '#6390F0' },
    { name: 'electric', color: '#F7D02C' },
    { name: 'grass', color: '#7AC74C' },
    { name: 'ice', color: '#96D9D6' },
    { name: 'fighting', color: '#C22E28' },
    { name: 'poison', color: '#A33EA1' },
    { name: 'ground', color: '#E2BF65' },
    { name: 'flying', color: '#A98FF3' },
    { name: 'psychic', color: '#F95587' },
    { name: 'bug', color: '#A6B91A' },
    { name: 'rock', color: '#B6A136' },
    { name: 'ghost', color: '#735797' },
    { name: 'dragon', color: '#6F35FC' },
    { name: 'dark', color: '#705746' },
    { name: 'steel', color: '#B7B7CE' },
    { name: 'fairy', color: '#D685AD' },
  ];

  pokeOffset: number = 1;
  classicLimit: number = 151;
  baseUrl: string = `https://pokeapi.co/api/v2/pokemon/`;

  constructor(private http: HttpClient) {}

  async prepareUrlToFetch() {
    while (this.pokeOffset <= this.classicLimit) {
      const url = `${this.baseUrl}${this.pokeOffset}/`;
      await this.getClassicPokeDetails(url);
      this.pokeOffset++;
    }
  }

  fetchClassicPokemon(url: string): Observable<Root> {
    return this.http.get<Root>(url);
  }

  async getClassicPokeDetails(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchClassicPokemon(url).subscribe({
        next: (pokemon) => {
          // console.log(pokemon);
          
          this.allPokemon.push(pokemon);
          resolve();
        },
        error: (err) => {
          console.log('Error fetching Pokemon', err);
          reject(err);
        },
      });
    });
  }

  pokeDetailWithIndex(){
    return this.displayedPokemon[this.selectedIndexForDetails];
  }

  /**
   *
   * @param types
   * @returns array with pokemon types
   */
  getPokeTypes(types: PokemonTypes[]) {
    let typesArr;
    types.forEach((type) => {
      typesArr.push(type);
    });
    return typesArr;
  }

  /**
   *
   * @param pokemon
   * @returns the color for the pokemon type
   */
  getBgColor(pokemon: PokemonDetails): string {
    const type = pokemon.types[0].type.name;
    const colorObj = this.colors.find((color) => color.name === type);
    return colorObj ? colorObj.color : 'green';
  }

  resetSearch(){
    this.searchedPokemon = [];
    this.displayedPokemon = this.allPokemon;
  }

  filterPokemon(input: string){
    this.resetSearch();
    let filteredPokemon = this.allPokemon.filter(pokemon => this.searchPokemon(pokemon.name.toLowerCase(), input));
    this.displayedPokemon = filteredPokemon;
  }

  searchPokemon(pokeName: string, input: string){
    return pokeName.includes(input);
  }
}
