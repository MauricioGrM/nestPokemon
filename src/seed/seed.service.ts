import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly fetchAdapter: FetchAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.fetchAdapter.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // const inserPromisesArray: Promise<Pokemon>[] = [];

    // data.results.forEach(({ name, url }) => {
    //   const segments = url.split('/');
    //   const pokemonNumber = +segments[segments.length - 2];

    //   inserPromisesArray.push(
    //     this.pokemonModel.create({ name, pokemonNumber }),
    //   );
    // });

    // await Promise.all(inserPromisesArray);

    const pokemonsToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const pokemonNumber = +segments[segments.length - 2];

      return { name, pokemonNumber };
    });

    this.pokemonModel.insertMany(pokemonsToInsert);

    return 'Seed Executed';
  }
}
