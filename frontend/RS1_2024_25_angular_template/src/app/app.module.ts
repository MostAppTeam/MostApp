import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; // Uključujemo rute
import { AppComponent } from './app.component';

// Komponente koje se koriste u aplikaciji
import { AdminModule } from './modules/admin/admin.module';  // Importuj AdminModule
import { EventsComponent } from './modules/admin/events/event.component';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';
import { WeatherComponent } from './modules/admin/weather/weather.component'; // Ispravljena putanja
import { OffersComponent } from './modules/admin/offers/offers.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,            // Dodata komponenta
    UserRecommendationsComponent,
    WeatherComponent,          // Ispravljena komponenta
    OffersComponent,            // Komponenta za ponude
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,          // Rute
    AdminModule,               // Dodaj AdminModule ovde
  ],
  providers: [],
  bootstrap: [AppComponent],   // Pokretanje glavne komponente
})

export class AppModule {}
