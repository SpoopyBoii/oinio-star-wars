import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchPeople, fetchPlanets, fetchStarships } from '../services/swapi.service.ts';

export const usePeople = (page: number, search: string) => {
    return useQuery({
        queryKey: ['people', page, search],
        queryFn: () => fetchPeople(page, search),
        placeholderData: keepPreviousData,
    });
};

export const usePlanets = (page: number, search: string) => {
    return useQuery({
        queryKey: ['planets', page, search],
        queryFn: () => fetchPlanets(page, search),
        placeholderData: keepPreviousData,
    });
};

export const useStarships = (page: number, search: string) => {
    return useQuery({
        queryKey: ['starships', page, search],
        queryFn: () => fetchStarships(page, search),
        placeholderData: keepPreviousData,
    });
};