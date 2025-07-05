import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { RegisterGuard } from './guards/register-guard.guard';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'search',
		pathMatch: 'full'
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [RegisterGuard]
	},
	{
		path: 'search',
		component: SearchComponent
	},
	{
		path: '**',
		redirectTo: 'search'
	}
];