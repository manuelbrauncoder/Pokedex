import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonDetails } from '../interfaces/pokemon-details';
import { PokemonTypes } from '../interfaces/pokemon-types';
import { TypeColor } from '../interfaces/type-color';
import { Root, Species } from '../interfaces/types';
import { EvolutionChain, SpeciesDetails } from '../interfaces/species';
import { DisplayedChain, EvolutionChainDetails } from '../interfaces/chain';
import { Pokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  displayedPokemon: Root[] = [];
  searchedPokemon: Root[] = [];
  allPokemon: Root[] = [];

  chartLabels: string[] = [];
  chartData: number[] = [];

  allDetails: Root[] = []; // just for evolution chain

  isLoading: boolean = false; // loading spinner

  selectedIndexForDetails: number = 0;

  evoUrl: string = '';
  currentEvoChain: EvolutionChainDetails[] = [];

  evoChainCache: any;

  chain: DisplayedChain[] = [];

  completePokeList: Pokemon[] = [];
  imgUrl: string = '';

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
  allLimit: number = 1025;
  allOffset: number = 1;
  baseUrl: string = `https://pokeapi.co/api/v2/pokemon/`;
  completeListUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';

  constructor(private http: HttpClient) {}

  async prepareUrlForAll() {
    while (this.allOffset <= this.allLimit) {
      const url = `${this.baseUrl}${this.allOffset}/`;
      await this.getAllDetails(url);
      this.allOffset++;
    }
  }

  fetchAllDetails(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getAllDetails(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchAllDetails(url).subscribe({
        next: (all) => {
          this.allDetails.push(all);
          resolve();
        },
        error: (err) => {
          console.log('Error fetching all Details', err);
          reject();
        },
      });
    });
  }

  fetchCompleteList(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getCompleteList(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchCompleteList(this.completeListUrl).subscribe({
        next: (poke) => {
          this.completePokeList = poke.results;
          resolve();
        },
        error: (err) => {
          console.log('Error fetching complete pokemonlist', err);
          reject(err);
        },
      });
    });
  }

  /**
   * prepare url for classic pokemon
   */
  async prepareUrlToFetch() {
    while (this.pokeOffset <= this.classicLimit) {
      const url = `${this.baseUrl}${this.pokeOffset}/`;
      await this.getClassicPokeDetails(url);
      this.pokeOffset++;
    }
  }

  /**
   * 
   * @param url 
   * @returns a subscribable Observable
   */
  fetchClassicPokemon(url: string): Observable<Root> {
    return this.http.get<Root>(url);
  }

  /**
   * 
   * @param url 
   * @returns a promise with pokomon details
   */
  async getClassicPokeDetails(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchClassicPokemon(url).subscribe({
        next: (pokemon) => {
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

  pokeDetailWithIndex() {
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

  resetSearch() {
    this.searchedPokemon = [];
    this.displayedPokemon = this.allPokemon;
  }

  filterPokemon(input: string) {
    this.resetSearch();
    let filteredPokemon = this.allPokemon.filter((pokemon) =>
      this.searchPokemon(pokemon.name.toLowerCase(), input)
    );
    this.displayedPokemon = filteredPokemon;
  }

  searchPokemon(pokeName: string, input: string) {
    return pokeName.includes(input);
  }

  fetchSpecies(url: string): Observable<SpeciesDetails> {
    return this.http.get<SpeciesDetails>(url);
  }

  fetchEvoChain(url: string): Observable<EvolutionChainDetails> {
    return this.http.get<EvolutionChainDetails>(url);
  }

  async getEvochain(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchEvoChain(url).subscribe({
        next: (res) => {
          console.log('getEvoChain log', res);
          this.cacheChainDetails(res);
          resolve();
        },
        error: (err) => {
          console.log('Error fetching Evo Chain', err);
          reject(err);
        },
      });
    });
  }

  async cacheChainDetails(res: EvolutionChainDetails) {
    this.imgUrl = '';
    this.chain = [];
    
    if (res.chain && res.chain.species && res.chain.species.name) {
      let url1: string = this.getImageForChain(res.chain.species.name);
      let obj1 = this.getChainObject(res.chain.species.name, url1);
      
      this.chain.push(obj1);
      
      if (res.chain.evolves_to && res.chain.evolves_to.length > 0) {
        let url2 = this.getImageForChain(res.chain.evolves_to[0].species.name);
        let obj2 = this.getChainObject(res.chain.evolves_to[0].species.name, url2);
        
        this.chain.push(obj2);
        
        if (res.chain.evolves_to[0].evolves_to && res.chain.evolves_to[0].evolves_to.length > 0) {
          let url3 = this.getImageForChain(res.chain.evolves_to[0].evolves_to[0].species.name);
          let obj3 = this.getChainObject(res.chain.evolves_to[0].evolves_to[0].species.name, url3);
          
          this.chain.push(obj3);
        }
      }
    }
  
  }

  getImageForChain(name: string): string {
    let imgUrl: string = '';
  
    this.allDetails.forEach((pokemon) => {
      if (pokemon && pokemon.name.toLowerCase() === name.toLowerCase()) {
        imgUrl = pokemon.sprites.other['official-artwork'].front_default;
      }
    });
  
    return imgUrl || 'default_image_url'; // Fallback-Wert
  }

  getChainObject(pokename: string, pokeUrl: string) {
    return {
      name: pokename,
      url: pokeUrl,
    };
  }

  async getSpecies(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchSpecies(url).subscribe({
        next: (res) => {
          this.evoUrl = res.evolution_chain.url;
          resolve();
        },
        error: (err) => {
          console.log('Error fetching Pokemon', err);
          reject(err);
        },
      });
    });
  }
}
