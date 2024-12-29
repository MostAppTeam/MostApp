import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component';
import { AttractionsComponent } from './modules/admin/attractions/attractions.component';
import { OffersComponent } from './modules/admin/offers/offers.component';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { SignUpComponent } from './modules/admin/sign-up/sign-up.component';
import { ShoppingCentersComponent } from './modules/admin/shopping-centers/shopping-centers.component';
import {InviteFriendComponent} from './modules/admin/ invite-friend/invite-friend.component';
import {ResetPasswordComponent} from './modules/admin/reset-password/reset-password.component';
import {ActivateAccountComponent} from './modules/admin/activate-account/activate-account.component';

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
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'invite-friend', component: InviteFriendComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
