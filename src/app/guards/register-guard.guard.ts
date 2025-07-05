import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

export const RegisterGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const customerService = inject(CustomerService);

  const uuid = route.queryParams['uuid'];
  if (!uuid) return true;

  const customer = customerService.getByUUID(uuid);

  if (customer) {
    return true;
  } else {
    router.navigate(['/search'], {
      state: { notFound: true }
    });
    
    return false;
  }
};