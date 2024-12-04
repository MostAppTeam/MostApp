import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './modules/admin/admin.module';  // Importuj AdminModule

@NgModule({
  declarations: [AppComponent], // Nema potrebe da importuješ AttractionsComponent ovde
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AdminModule,  // Dodaj AdminModule ovde
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
