import { ActivatedRoute, Router } from '@angular/router';
import { BrasilapiService } from '../services/brasilapi.service';
import { City } from '../models/city';
import { Component, inject, ViewChild } from '@angular/core';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { firstValueFrom } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { InvalidDocumentDirective } from '../shared/directives/invalid-document.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { State } from '../models/state';
import { v4 as uuid } from 'uuid';

interface RouterStateParams {
  saved?: boolean;
  deleted?: boolean;
  [key: string]: boolean | undefined; 
}

@Component({
  selector: 'app-register',
  imports: [
    FlexLayoutModule,
    FormsModule,
    InvalidDocumentDirective,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    NgxMaskDirective,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private brasilapiService: BrasilapiService = inject(BrasilapiService);
  private customerService: CustomerService = inject(CustomerService);
  private dialog: MatDialog = inject(MatDialog);
  private matSnackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  public cities: City[] = [];
  public citiesFilter: FormControl = new FormControl();
  public filteredCities: City[] = [];
  public filteredStates: State[] = [];
  public customer: Customer = new Customer();
  public states: State[] = [];
  public statesFilter: FormControl = new FormControl();

  @ViewChild('customerForm') customerForm!: NgForm;

  public ngOnInit(): void {
    const uuid = this.activatedRoute.snapshot.queryParamMap.get('uuid');

    if (uuid) {
      this.customer = this.customerService.getByUUID(uuid);
      this.getCities({ value: this.customer.state } as MatSelectChange);
    }

    this.getStates();
    this.createSearchFilters();
  }

  private getStates(): void {
    this.brasilapiService.getStatesOrdered().subscribe({
      next: (states: State[]) => {
        this.filteredStates = states;
        this.states = states;
      },
      error: (error: HttpErrorResponse) => {
        this.matSnackBar.open(error.message, '', {
          duration: 3000,
          panelClass: ['warn-snackbar']
        });
      }
    });
  }

  private createSearchFilters(): void {
    this.citiesFilter.valueChanges.subscribe((search: string) => {
      this.filteredCities = this.cities.filter((city: City) =>this.normalize(city.nome).includes(this.normalize(search ?? '')));
    });

    this.statesFilter.valueChanges.subscribe((search: string) => {
      this.filteredStates = this.states.filter((state: State) => this.normalize(state.nome).includes(this.normalize(search ?? '')) || this.normalize(state.sigla).includes(this.normalize(search ?? '')));
    });
  }

  public getCities(event: MatSelectChange): void {
    this.brasilapiService.getCitiesOrdered(event.value).subscribe({
      next: (cities: City[]) => {
        this.filteredCities = cities;
        this.cities = cities;
      },
      error: (error: HttpErrorResponse) => {
        this.matSnackBar.open(error.message, '', {
          duration: 3000,
          panelClass: ['warn-snackbar']
        });
      }
    });
  }

  public saveCustomer(): void {
    if (!this.customerForm.invalid) {
      this.trimFields();

      this.customer.uuid ||= uuid();
      this.customerService.save(this.customer);

      this.customer = new Customer();
      this.customerForm.resetForm();

      this.navigateToSearch({ saved: true });
    } else {
      this.customerForm.form.markAllAsTouched();
      
      this.matSnackBar.open('Existem campos de preenchimento obrigatório!', '', {
        duration: 3000,
        panelClass: ['warn-snackbar']
      });
    }
  }

  public async deleteCustomer(uuid: string): Promise<void> {
    if (await this.openConfirmDialog()) {
      this.customerService.delete(uuid);

      this.navigateToSearch({ deleted: true });
    }
  }

  public openConfirmDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { 
        message: 'Confirma excluir o cliente?'
      },
      width: '300px',
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  private trimFields(): void {
    const keys: (keyof Customer)[] = Object.keys(this.customer) as (keyof Customer)[];

    for (const key of keys) {
      if (typeof this.customer[key] === 'string') {
        this.customer[key] = this.customer[key].trim();
      }
    }
  }

  public navigateToSearch(state: RouterStateParams): void {
    this.router.navigate(['search'], { state });
  }

  private normalize(name: string): string {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
}