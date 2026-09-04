import type { SWAPIResponse, Person, Planet, Starship } from '../types/swapi.types.ts';

const BASE_URL = 'https://swapi.py4e.com/api';

export const fetchPeople = async (page: number = 1, search: string = ''): Promise<SWAPIResponse<Person>> => {
  const url = new URL(`${BASE_URL}/people/`);
  url.searchParams.append('page', page.toString());
  if (search) url.searchParams.append('search', search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch characters from SWAPI');
  return res.json();
};

export const fetchPlanets = async (page: number = 1, search: string = ''): Promise<SWAPIResponse<Planet>> => {
  const url = new URL(`${BASE_URL}/planets/`);
  url.searchParams.append('page', page.toString());
  if (search) url.searchParams.append('search', search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch planets from SWAPI');
  return res.json();
};

export const fetchStarships = async (page: number = 1, search: string = ''): Promise<SWAPIResponse<Starship>> => {
  const url = new URL(`${BASE_URL}/starships/`);
  url.searchParams.append('page', page.toString());
  if (search) url.searchParams.append('search', search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch starships from SWAPI');
  return res.json();
};