import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';

@NgModule({
  declarations: [
    AppComponent,
    MuseumsComponent,
    EventsComponent,
    UserRecommendationsComponent, // Dodata komponenta
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
