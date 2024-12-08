import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './modules/admin/admin.module';  // Importuj AdminModule
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';
import { EventsComponent } from './modules/admin/events/event.component'; // Ispravljeno ime fajla
import { WeatherComponent } from './modules/admin/weather/weather.component'; // Ispravljena putanja
@NgModule({
  declarations: [AppComponent,EventsComponent, // Dodata komponenta
    UserRecommendationsComponent,
    WeatherComponent,], // Ispravljena komponenta], // Nema potrebe da importuješ AttractionsComponent ovde
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AdminModule,BrowserModule,
  FormsModule,
  HttpClientModule,
  AppRoutingModule,  // Dodaj AdminModule ovde
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
