import { PokemonTypes } from './pokemon-types';

export interface PokemonDetails {
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  id: number;
  types: PokemonTypes[];
}
