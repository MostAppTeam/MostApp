import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './modules/admin/weather/weather.component'; // Ispravljena putanja
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';

const routes: Routes = [
  { path: '', redirectTo: '/recommendations', pathMatch: 'full' },
  { path: 'recommendations', component: UserRecommendationsComponent },
  { path: 'weather', component: WeatherComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
