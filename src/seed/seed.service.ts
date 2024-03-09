import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponse } from './interfaces/pokemon-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axiosAdapter: AxiosAdapter
  ) { }

  async executedSeed() {
    await this.pokemonModel.deleteMany();
    const { results } = await this.axiosAdapter.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=50');
    const formatPokemon = results.map(result => {
      return {
        name: result.name,
        no: +result.url.split('/')[result.url.split('/').length - 2]
      };
    });
    await this.pokemonModel.insertMany(formatPokemon);
    return formatPokemon;
  }
}