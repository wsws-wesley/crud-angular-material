import { Customer } from '../models/customer';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private repository = 'customers'

  private get(): Customer[] {
    const customers: string | null = localStorage.getItem(this.repository);

    if (customers) {
      return JSON.parse(customers);
    } else {
      return [];
    }
  }

  public getByUUID(uuid: string): Customer {
    const customers: Customer[] = this.get();

    return customers.find((customer: Customer) => customer.uuid === uuid)!;
  }

  public getByName(name: string): Customer[] {
    return this.get().filter((customer: Customer) => this.normalize(customer.name).includes(this.normalize(name)));
  }

  public save(register: Customer): void {
    const customers = this.get();
    const index = customers.findIndex((customer: Customer) => customer.uuid === register.uuid);

    if (index > -1) {
      customers[index] = register;
    } else {
      customers.push(register);
    }

    localStorage.setItem(this.repository, JSON.stringify(customers));
  }

  public delete(uuid: string): void {
    const customers = this.get().filter((customer: Customer) => customer.uuid !== uuid);

    localStorage.setItem(this.repository, JSON.stringify(customers));
  }

  private normalize(name: string): string {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
}