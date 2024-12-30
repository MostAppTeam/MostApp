import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop'

// Komponente koje se koriste u Admin modulu
import { DashboardComponent } from './dashboard/dashboard.component';
import { DestinationComponent } from './destination/destination.component';
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
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {InviteFriendComponent} from './ invite-friend/invite-friend.component';
import {ActivateAccountComponent} from './activate-account/activate-account.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DestinationComponent,
    ReservationComponent,
    AdminErrorPageComponent,
    CitiesComponent,
    CitiesEditComponent,
    AttractionsComponent,
    MuseumsComponent,
    EventsComponent,
    OffersComponent,
    UserRecommendationsComponent,
    ShoppingCentersComponent,
    InviteFriendComponent,
    ActivateAccountComponent,
    ResetPasswordComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
    DragDropModule// Deljenje funkcionalnosti
  ],
  providers: [],
})
export class AdminModule {}
