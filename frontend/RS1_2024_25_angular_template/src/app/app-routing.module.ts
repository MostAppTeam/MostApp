import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from './modules/admin/offers/offers.component';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';

// Definisanje ruta
const routes: Routes = [
  { path: '', component: UserRecommendationsComponent }, // Početna stranica (Home) kao podrazumevana ruta
  { path: 'home', component: UserRecommendationsComponent }, // Home page
  { path: 'offers', component: OffersComponent }, // Offers page
  { path: '**', redirectTo: '/home' }, // Ako ruta nije prepoznata, preusmeri na Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
