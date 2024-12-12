import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component';
import { AttractionsComponent } from './modules/admin/attractions/attractions.component';
import { OffersComponent } from './modules/admin/offers/offers.component';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ShoppingCentersComponent } from './modules/admin/shopping-centers/shopping-centers.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: UserRecommendationsComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'museums', component: MuseumsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'attractions', component: AttractionsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  {path: 'shopping-centers', component: ShoppingCentersComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
