import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component';
import { WeatherComponent } from './modules/admin/weather/weather.component'; // Ispravljena putanja
import { AttractionsComponent } from './modules/admin/attractions/attractions.component'; // Uvezi AttractionsComponent

const routes: Routes = [
  { path: '', redirectTo: '/museums', pathMatch: 'full' },
  { path: 'museums', component: MuseumsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'attractions', component: AttractionsComponent }, // Dodaj rutu za AttractionsComponent
  { path: 'weather', component: WeatherComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
