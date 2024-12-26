import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from './modules/admin/offers/offers.component'; // Dodaj potrebne importe

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Specifične rute koje nisu dio admin modula
  { path: 'offers', component: OffersComponent },
  // Lazy loading za admin modul
  {
    path: '',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
