import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; // Uključujemo rute
import { AppComponent } from './app.component';

// Importujemo AdminModule, koji sadrži sve potrebne komponente
import { AdminModule } from './modules/admin/admin.module';
import { LoginComponent } from './modules/admin/login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent, // Glavna komponenta
    // Nema potrebe da se ovde deklariraju EventsComponent, OffersComponent itd.
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,          // Rute
    AdminModule,               // Dodajemo AdminModule koji već sadrži sve potrebne komponente
  ],
  providers: [],
  bootstrap: [AppComponent],   // Pokretanje glavne komponente
})
export class AppModule {}
