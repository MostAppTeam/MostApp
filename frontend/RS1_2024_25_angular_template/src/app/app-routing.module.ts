import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Komponente koje se koriste u AppRoutingModule
import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component';
import { WeatherComponent } from './modules/admin/weather/weather.component'; // Ispravljena putanja
import { AttractionsComponent } from './modules/admin/attractions/attractions.component'; // Uvezi AttractionsComponent
import { OffersComponent } from './modules/admin/offers/offers.component';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';

const routes: Routes = [
  // Home stranica
  { path: '', component: UserRecommendationsComponent }, // Početna stranica (Home) kao podrazumevana ruta
  { path: 'home', component: UserRecommendationsComponent }, // Home page

  // Rute za admin deo
  { path: 'offers', component: OffersComponent }, // Offers page
  { path: 'museums', component: MuseumsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'attractions', component: AttractionsComponent }, // Ruta za AttractionsComponent
  { path: 'weather', component: WeatherComponent },

  // Ako ruta nije prepoznata, preusmeri na Home
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
