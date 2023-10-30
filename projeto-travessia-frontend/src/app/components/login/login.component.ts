import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'firebase/auth';
import {getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public userName = '';
  public password = '';
 
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    
  }

  login() {
    this.authService.Login(this.userName, this.password)
    }
}
