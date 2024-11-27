import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRecommendationsComponent } from './modules/admin/user-recommendations/user-recommendations.component';

const routes: Routes = [
  { path: '', redirectTo: '/recommendations', pathMatch: 'full' },
  { path: 'recommendations', component: UserRecommendationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
