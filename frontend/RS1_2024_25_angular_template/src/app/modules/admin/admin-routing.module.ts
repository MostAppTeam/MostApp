import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationComponent } from './destination/destination.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AdminErrorPageComponent } from './admin-error-page/admin-error-page.component';
import { CitiesComponent } from './cities/cities.component';
import { CitiesEditComponent } from './cities/cities-edit/cities-edit.component';
import { AttractionsComponent } from './attractions/attractions.component';
import { MuseumsComponent } from './museums/museums.component';
import { EventsComponent } from './events/event.component';
import { OffersComponent } from './offers/offers.component';
import { UserRecommendationsComponent } from './user-recommendations/user-recommendations.component';
import { ShoppingCentersComponent } from './shopping-centers/shopping-centers.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cities', component: CitiesComponent },
  { path: 'cities/new', component: CitiesEditComponent },
  { path: 'cities/edit/:id', component: CitiesEditComponent },
  { path: 'destination', component: DestinationComponent },
  { path: 'order', component: ReservationComponent },
  { path: 'attractions', component: AttractionsComponent },
  { path: 'museums', component: MuseumsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'shopping-centers', component: ShoppingCentersComponent },
  { path: 'home', component: UserRecommendationsComponent },
  { path: '**', component: AdminErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
