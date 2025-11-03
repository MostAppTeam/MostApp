import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {MyAuthService} from './services/auth-services/my-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbar = true;
  showHeroSection = true;
  showFooter = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const route = event.urlAfterRedirects;
        // Prikazujemo hero sekciju i footer samo za Home
        this.showNavbar = true; // Navigacija ostaje vidljiva
        this.showHeroSection = route === '/home';
        this.showFooter = route === '/home';
      }
    });
  }

  showLogoutModal = false;

  onLogout(): void {
    this.showLogoutModal = true; // otvara modal
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/logout']);
  }

  cancelLogout(): void {
    this.showLogoutModal = false; // zatvara modal bez odjave
  }



}
