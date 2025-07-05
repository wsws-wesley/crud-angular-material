import { inject, Injectable } from '@angular/core';
import { City } from '../models/city';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class BrasilapiService {
  private httpClient: HttpClient = inject(HttpClient);

  private url: string = 'https://brasilapi.com.br/api/ibge';

  private getStates(): Observable<State[]> {
    return this.httpClient.get<State[]>(`${this.url}/uf/v1`);
  }

  public getStatesOrdered(): Observable<State[]> {
    return this.getStates().pipe(
      map((states: State[]) => states.sort((a: State, b: State) => a.nome.localeCompare(b.nome)))
    );
  }

  private getCities(stateCode: string): Observable<City[]> {
    return this.httpClient.get<City[]>(`${this.url}/municipios/v1/${stateCode}`);
  }

  public getCitiesOrdered(stateCode: string): Observable<City[]> {
    return this.getCities(stateCode).pipe(
      map((cities: City[]) => cities.sort((a: City, b: City) => a.nome.localeCompare(b.nome)))
    )
  }
}