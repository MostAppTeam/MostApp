import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component'; // Ispravljeno ime fajla
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';
import { WeatherComponent } from './modules/admin/weather/weather.component'; // Ispravljena putanja

@NgModule({
  declarations: [
    AppComponent,
    MuseumsComponent,
    EventsComponent, // Dodata komponenta
    UserRecommendationsComponent,
    WeatherComponent, // Ispravljena komponenta
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
