'use strict';

export default class SettingsController {
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    iftttKey: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  submitted = false;
  iftttMessage = '';


  /*@ngInject*/
  constructor(Auth) {
    this.Auth = Auth;
  }

  $onInit() {
    this.user.iftttKey = this.Auth.getCurrentUserSync().iftttKey;
  }

  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
  changeIftttKey() {
    this.Auth.changeIftttKey(this.user.iftttKey)
      .then(() => {
        this.iftttMessage = 'IFTTT Key successfully changed.';
      })
      .catch(() => {
        this.iftttMessage = '';
      });
  }
}
