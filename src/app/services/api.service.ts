import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon';
import { PokemonDetails } from '../interfaces/pokemon-details';
import { PokemonTypes } from '../interfaces/pokemon-types';
import { TypeColor } from '../interfaces/type-color';
import { Type } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private pokeListUrl =
    'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';

  pokeList: Pokemon[] = []; // list of all pokemon with name and url
  pokeDetails: PokemonDetails[] = []; // loaded pokemon with details

  numberToFetch: number = 25; // number of pokemon to load
  offset: number = 0; // offset for the next pokemon
  selectedIndexForDetails: number = 0;

  searchedPokemon: Pokemon[] = []; // list of searched pokemon with name and url
  searchedPokeDetails: PokemonDetails[] = []; // pokemon details of searched pokemon

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

  constructor(private http: HttpClient) {}

  /**
   * load more pokemon with details
   * offset: start for the loop
   * numberToFetch: End for the loop
   */
  async loadMorePokemon() {
    this.resetSearch();
    this.numberToFetch += 25;
    this.offset += 25;
    await this.loadPokeDetails(this.pokeList, this.pokeDetails);
    console.log('no search details:', this.pokeDetails);
    console.log('details search:', this.searchedPokeDetails);
    
  }

  resetSearch(){
    this.searchedPokemon = [];
    this.searchedPokeDetails = [];
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
  async loadPokeDetails(listArr: Pokemon[], detailArr: PokemonDetails[]) {
    for (let i = this.offset; i < this.numberToFetch; i++) { 
      await this.getPokeDetails(i, listArr, detailArr);
    }
  }

  async loadSearchDetails(listArr: Pokemon[], detailArr: PokemonDetails[]) {
    for (let i = this.offset; i < listArr.length; i++) { 
      await this.getPokeDetails(i, listArr, detailArr);
    }
  }

  /**
   * load poke details for current index
   * @param index
   * @returns promise with poke details
   */
  async getPokeDetails(
    index: number,
    listArr: Pokemon[],
    arrToPush: PokemonDetails[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = listArr[index].url;
      this.fetchPokeDetails(url).subscribe({
        next: (details) => {
          //console.log(details);

          arrToPush.push(
            this.getPokeDetailObject(
              details.name,
              details.sprites.other['official-artwork'].front_default,
              details.id,
              details.types
            )
          );
          resolve();
        },
        error: (err) => {
          console.log('Error fetching Pokemon Details', err);
          reject(err);
        }
      });
    });
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
        complete: () => {},
      });
    });
  }

  /**
   *
   * @param name
   * @param img
   * @returns a PokemonDetails Object
   */
  getPokeDetailObject(
    name: string,
    img: string,
    id: number,
    types: PokemonTypes[]
  ): PokemonDetails {
    return {
      name: name,
      sprites: {
        other: {
          'official-artwork': {
            front_default: img,
          },
        },
      },
      id: id,
      types: types,
    };
  }

  /**
   * clear the search arrays
   * load details form searched pokemon
   * @param input 
   */
  async searchPokemon(input: string) {
    this.searchedPokemon = [];
    this.searchedPokeDetails = [];
    
    let filteredPokemon = this.pokeList.filter((pokemon) =>
      this.search(pokemon.name.toLowerCase(), input.toLowerCase())
    );
    this.searchedPokemon = filteredPokemon;
    await this.loadSearchDetails(this.searchedPokemon, this.searchedPokeDetails);
    
  }

  /**
   * 
   * @param name 
   * @param input 
   * @returns return the name that is included in the array
   */
  search(name: string, input: string) {
    return name.includes(input);
  }

  /**
   * 
   * @returns the all pokemon or searched pokemon
   */
  arrToShown() {
    if (this.searchedPokeDetails.length > 0) {
      return this.searchedPokeDetails[this.selectedIndexForDetails];
    } else {
      return this.pokeDetails[this.selectedIndexForDetails];
    }
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
}
