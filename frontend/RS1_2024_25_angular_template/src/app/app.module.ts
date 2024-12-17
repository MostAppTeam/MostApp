import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminModule } from './modules/admin/admin.module';
import { SignUpComponent } from './modules/admin/sign-up/sign-up.component'; // Import komponenti
import { LoginComponent } from './modules/admin/login/login.component';
import { MyAuthService } from './services/auth-services/my-auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent // Ispravno deklarisan SignUpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AdminModule
  ],
  providers: [
    MyAuthService], // dodaj MyAuthService ovde

  bootstrap: [AppComponent]
})
export class AppModule {}
