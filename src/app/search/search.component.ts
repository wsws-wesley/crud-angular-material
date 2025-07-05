import { Component, inject } from '@angular/core';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { DobPipe } from "../shared/pipes/dob-mask.pipe";
import { DocumentPipe } from "../shared/pipes/document.pipe";
import { firstValueFrom } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [
    DobPipe,
    DocumentPipe,
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule
],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private customerService: CustomerService = inject(CustomerService);
  private dialog: MatDialog = inject(MatDialog);
  private matSnackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  public customerColumns: string[] = ['uuid', 'name', 'email', 'document', 'dob', 'actions'];
  public customers: Customer[] = [];
  public name: string = '';
  public notFound: boolean = false;

  constructor() {
    this.handleSnackBarMessagesFromState();
  }

  private handleSnackBarMessagesFromState(): void {
    const state = this.router.getCurrentNavigation()?.extras?.state;

    if (!state) return;

    if (state['deleted']) {
      setTimeout(() => {
        this.matSnackBar.open('Cliente excluído com sucesso!', '', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      }, 150);
    }

    if (state['notFound']) {
      setTimeout(() => {
        this.matSnackBar.open('Cliente não encontrado!', '', {
          duration: 3000,
          panelClass: ['warn-snackbar'],
        });
      }, 150);
    }

    if (state['saved']) {
      setTimeout(() => {
        this.matSnackBar.open('Cliente salvo com sucesso!', '', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      }, 150);
    }

    this.router.navigate([], {
      queryParams: { error: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  public ngOnInit(): void {
    this.getCustomers();
  }

  public getCustomers(): void {
    this.customers = this.customerService.getByName(this.name);
  }

  public updateCustomer(uuid: string): void {
    this.router.navigate(
      ['register'], 
      { 
        queryParams: { 
          uuid: uuid
        }
      }
    )
  }

  public async deleteCustomer(uuid: string): Promise<void> {
    if (await this.openConfirmDialog()) {
      this.customerService.delete(uuid);

      setTimeout(() => {
        this.matSnackBar.open('Cliente excluído com sucesso!', '', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      }, 150);
    }

    this.getCustomers();
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
}