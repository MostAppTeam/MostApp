import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; // Uključujemo rute
import { AppComponent } from './app.component';
import { OffersComponent } from './modules/admin/offers/offers.component';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';

@NgModule({
  declarations: [
    AppComponent,
    OffersComponent,
    UserRecommendationsComponent, // Home page
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule, // Rute
  ],
  providers: [],
  bootstrap: [AppComponent], // Pokretanje glavne komponente
})

export class AppModule {}
