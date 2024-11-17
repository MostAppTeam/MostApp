import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuseumsComponent } from './modules/admin/museums/museums.component';

const routes: Routes = [
  { path: '', redirectTo: '/museums', pathMatch: 'full' },
  { path: 'museums', component: MuseumsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
