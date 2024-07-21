import { PokemonTypes } from "./pokemon-types";

export interface PokemonDetails {
    name: string;
    sprites: {
        front_default: string;
    };
    id: number;
    types: PokemonTypes[];
}
