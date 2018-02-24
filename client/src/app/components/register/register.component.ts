import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        RegisterComponent.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        RegisterComponent.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        RegisterComponent.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm') });
  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  static validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true }
    }
  }

  static validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true }
    }
  }

  static validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true }
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingPasswords': true }
      }
    }
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    this.authService.registerUser(user).subscribe(data => {
      if (!(<any>data).success) {
        this.registerFail((<any>data).message)
      } else {
        this.registerSuccess((<any>data).token, (<any>data).message)
      }
    });
  }


  registerFail (message) {
    this.messageClass = 'alert alert-danger';
    this.message = message;
    this.processing = false;
    this.enableForm();
  }

  registerSuccess (token, message) {
    this.messageClass = 'alert alert-success';
    this.message = message;
    this.registerSuccessTimeout()
  }

  registerSuccessTimeout () {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000)
  }


  checkEmail() {
    this.authService.checkEmail((this.form.get('email').value)).subscribe(data => {
      if(!(<any>data).success) {
        this.emailValid = false;
        this.emailMessage = (<any>data).message;
      } else {
        this.emailValid = true;
        this.emailMessage = (<any>data).message;
      }
    })
  }

  checkUsername() {
    this.authService.checkUsername((this.form.get('username').value)).subscribe(data => {
      if(!(<any>data).success) {
        this.usernameValid = false;
        this.usernameMessage = (<any>data).message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = (<any>data).message;
      }
    })
  }

  ngOnInit() {
  }

}
