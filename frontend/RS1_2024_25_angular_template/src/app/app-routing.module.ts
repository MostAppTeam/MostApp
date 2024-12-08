import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
import { WeatherComponent } from './modules/admin/weather/weather.component'; // Ispravljena putanja
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';

const routes: Routes = [
  { path: '', redirectTo: '/recommendations', pathMatch: 'full' },
  { path: 'recommendations', component: UserRecommendationsComponent },
  { path: 'weather', component: WeatherComponent },
=======
import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component';
import { AttractionsComponent } from './modules/admin/attractions/attractions.component'; // Uvezi AttractionsComponent

const routes: Routes = [
  { path: '', redirectTo: '/museums', pathMatch: 'full' },
  { path: 'museums', component: MuseumsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'attractions', component: AttractionsComponent }, // Dodaj rutu za AttractionsComponent
>>>>>>> main
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
