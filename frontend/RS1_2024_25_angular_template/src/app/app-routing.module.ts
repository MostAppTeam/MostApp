import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuseumsComponent } from './modules/admin/museums/museums.component';
import { EventsComponent } from './modules/admin/events/event.component'; // Ispravna ruta za EventsComponent

const routes: Routes = [
  { path: '', redirectTo: '/museums', pathMatch: 'full' },
  { path: 'museums', component: MuseumsComponent },
  { path: 'events', component: EventsComponent }, // Ruta za EventsComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
