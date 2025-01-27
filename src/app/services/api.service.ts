import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonTypes } from '../interfaces/pokemon-types';
import { TypeColor } from '../interfaces/type-color';
import { PokemonDetails } from '../interfaces/types';
import { SpeciesDetails } from '../interfaces/species';
import { DisplayedChain, EvolutionChainDetails } from '../interfaces/chain';
import { Pokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  displayedPokemon: PokemonDetails[] = []; // displayed pokemon
  searchedPokemon: PokemonDetails[] = []; // cache for searched pokemon
  allPokemon: PokemonDetails[] = []; // all details from loaded pokemon

  availableTypesForFilter: string[] = []; // available types for the filter function

  searchInput: string = '';

  chartLabels: string[] = [];
  chartData: number[] = [];

  detailsCache: PokemonDetails[] = [] // cache for image

  isLoading: boolean = false; // loading spinner

  selectedIndexForDetails: number = 0;

  evoUrl: string = '';
  currentEvoChain: EvolutionChainDetails[] = [];
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
  limit: number = 25;

  baseUrl: string = `https://pokeapi.co/api/v2/pokemon/`;
  completeListUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';

  currentTypeFilter: string = 'all';

  filteredByType: PokemonDetails[] = [];

  constructor(private http: HttpClient) {}

  /**
   * get available types for loaded pokemon
   * remove duplicates with Set
   */
  getTypesForFilter(){
    this.availableTypesForFilter = [];
    this.displayedPokemon.forEach(pokemon => {
      pokemon.types.forEach(type => {
        this.availableTypesForFilter.push(type.type.name);
      })
    })
    this.availableTypesForFilter = [...new Set(this.availableTypesForFilter)];
  }

  /**
   * filter displayed pokemon by type
   */
  filterByType() {
    this.resetSearch();
    if (this.currentTypeFilter.trim().toLowerCase() === 'all') {
      this.displayedPokemon = this.allPokemon;
    } else {
      this.filteredByType = this.allPokemon.filter(pokemon => this.aplyFilter(pokemon, this.currentTypeFilter));
      this.displayedPokemon = this.filteredByType;
    }
  }
  
  /**
   * 
   * @param pokemon 
   * @param typeFilter 
   * @returns true if the pokemon has the filter type
   */
  aplyFilter(pokemon: PokemonDetails, typeFilter: string): boolean {
    return pokemon.types.some(type => type.type.name.trim().toLowerCase() === typeFilter.trim().toLowerCase());
  }

  /**
   * load more pokemon
   */
  async loadMore(){
    this.limit += 25;
    this.isLoading = true;
    await this.prepareUrlToFetch();
    this.displayedPokemon = this.allPokemon;
    this.isLoading = false;
    this.getTypesForFilter();
  }

  fetchAllDetails(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  /**
   * push pokemon details to array
   * @param url 
   * @param arrToPush 
   * @returns 
   */
  getAllDetails(url: string, arrToPush: PokemonDetails[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchAllDetails(url).subscribe({
        next: (all) => {
          arrToPush.push(all);
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

  /**
   * download pokemon list, with name and url
   * @returns 
   */
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
   * prepare url for pokemon details
   */
  async prepareUrlToFetch() {
    while (this.pokeOffset <= this.limit) {
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
  fetchClassicPokemon(url: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(url);
  }

  /**
   * 
   * @param url 
   * @returns a promise with pokomon details
   */
  async getClassicPokeDetails(url: string): Promise<PokemonDetails | void> {
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

  /**
   * 
   * @returns the pokemon with selected index for detail view
   */
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

  /**
   * clear searched pokemon array, show all pokemon
   */
  resetSearch() {    
    this.searchedPokemon = [];
    this.displayedPokemon = this.allPokemon;
  }

  /**
   * change all pokemon to searched pokemon
   * @param input 
   */
  filterPokemon(input: string) {
    this.resetSearch();
    let trimmedInput = input.trim().toLowerCase();
    let filteredPokemon = this.allPokemon.filter(pokemon => 
      this.searchPokemon(pokemon.name.toLowerCase(), trimmedInput)
    );
    this.displayedPokemon = filteredPokemon;
  }

  /**
   * 
   * @param pokeName 
   * @param input 
   * @returns pokemon that includes input
   */
  searchPokemon(pokeName: string, input: string) {    
    return pokeName.includes(input);
  }

  fetchSpecies(url: string): Observable<SpeciesDetails> {
    return this.http.get<SpeciesDetails>(url);
  }

  fetchEvoChain(url: string): Observable<EvolutionChainDetails> {
    return this.http.get<EvolutionChainDetails>(url);
  }

  /**
   * Evolution Chain Details
   * @param url 
   * @returns 
   */
  async getEvochain(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchEvoChain(url).subscribe({
        next: (res) => {
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

  /**
   * save the current evolution chain
   * handle different chain numbers
   * @param res 
   */
  async cacheChainDetails(res: EvolutionChainDetails) {
    this.imgUrl = '';
    this.chain = [];
    
    if (res.chain && res.chain.species && res.chain.species.name) {
      let url1: string = await this.getImageForChain(res.chain.species.name);
      let obj1 = this.getChainObject(res.chain.species.name, url1);
      
      this.chain.push(obj1);
      
      if (res.chain.evolves_to && res.chain.evolves_to.length > 0) {
        let url2 = await this.getImageForChain(res.chain.evolves_to[0].species.name);
        let obj2 = this.getChainObject(res.chain.evolves_to[0].species.name, url2);
        
        this.chain.push(obj2);
        
        if (res.chain.evolves_to[0].evolves_to && res.chain.evolves_to[0].evolves_to.length > 0) {
          let url3 = await this.getImageForChain(res.chain.evolves_to[0].evolves_to[0].species.name);
          let obj3 = this.getChainObject(res.chain.evolves_to[0].evolves_to[0].species.name, url3);
          
          this.chain.push(obj3);
        }
      }
    }
  }

  /**
   * safe image url for current evolution chain
   * @param name 
   * @returns 
   */
  async getImageForChain(name: string): Promise<string> {
    this.detailsCache = [];
    let imgUrl: string = '';    
    for (let pokemon of this.completePokeList) {
      if (pokemon && pokemon.name.toLowerCase() === name.toLowerCase()) {        
        let url = pokemon.url;
        await this.getAllDetails(url, this.detailsCache);
        imgUrl = this.detailsCache[0].sprites.other['official-artwork'].front_default;
        break;
      }
    }
    return imgUrl || 'default_image_url';
  }

  /**
   * 
   * @param pokename 
   * @param pokeUrl 
   * @returns object for pokemon evolution chain
   */
  getChainObject(pokename: string, pokeUrl: string) {
    return {
      name: pokename,
      url: pokeUrl,
    };
  }

  /**
   * safe url for current evolution chain
   * @param url 
   * @returns 
   */
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
