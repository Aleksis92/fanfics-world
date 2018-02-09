import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { AuthGuard} from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authGuard: AuthGuard,
    private location: Location){
    this.createForm()
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  loginFail (message) {
    this.messageClass = 'alert alert-danger';
    this.message = message;
    this.processing = false;
    this.enableForm();
  }

  loginSuccess (message, user) {
    this.messageClass = 'alert alert-success';
    this.message = message;
    this.authService.storeUserData(user);
    this.loginSuccessTimeout()
  }

  loginSuccessTimeout () {
    setTimeout(() => {
      if(this.previousUrl) {
        this.router.navigate([this.previousUrl])
      } else {
        this.router.navigate(['/dashboard'])
      }
    }, 2000)
  }

  saveUserToken(token) {
      this.authService.storeUserToken(token)
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    this.authService.login(user).subscribe(data => {
      if (!(<any>data).success) {
        this.loginFail((<any>data).message)
      } else {
        this.saveUserToken((<any>data).token);
        this.loginSuccess((<any>data).message, (<any>data).user)
      }
    })
  }

  authGuardRedirect () {
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page.';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.token) {
        this.saveUserToken(params.token.replace(":", ""));
        this.authService.getProfile().subscribe(data => {
          console.log(data)
          this.loginSuccess("Social authentication success", (<any>data).user)
        });

      }
      this.location.replaceState("/login");
      this.authGuardRedirect()
    })
  }

}
