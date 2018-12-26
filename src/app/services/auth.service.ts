import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestResult, User } from '../models/dataModel';



@Injectable({
  providedIn: 'root'
})


export class AuthService {// environment.SERVICE_BASE+'/user';
  // base_url = 'http://localhost:5000/user';
  base_url = 'https://aqueous-sierra-10630.herokuapp.com/user';
  constructor(private httpClient: HttpClient) {

  }

  async login(u, p) {
    let r: RequestResult = { status: 0, message: '' };
    let url: string = this.base_url + '/login';
    console.log(url);

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    // .set('Authorization', 'Basic ' + btoa(username + ':' + password));
    await this.httpClient.post(url, { email: u, password: p }, { headers: headers }).toPromise()
      .then(
        (d) => {
          console.log(d);
          r = d as RequestResult;
          console.log(r.data);
          localStorage.setItem('mtAuth', JSON.stringify(r.data));
        }
      )
      .catch((err) => {
        r.message = err;
        r.status = 401;
        return r;
      });
    return r;
  }

  async getUserList(cid){
    let r: RequestResult = { status: 200, message: '' };
    await this.httpClient.get(this.base_url+'/getAll').toPromise()
    .then(
      (d) => {
        r.data = d;
        console.log(d);
      }
    )
    .catch((err) => {
      r.status = err.status;
      r.message = err.statusText;
    });
    return r;
  }

  getLoginUser(): any {
    let temp = localStorage.getItem('mtAuth');
    if (temp) {
      let userStroge = JSON.parse(localStorage.getItem('mtAuth'));// as User;

      return userStroge;
    }
    else return null;
  }

  updateStrogeAuth(_user: User) {
    let temp = localStorage.getItem('mtAuth');
    if (temp) {
      let userStroge = JSON.parse(localStorage.getItem('mtAuth'));// as User;

      userStroge.firstName = _user.firstName;
      userStroge.lastName = _user.lastName;
      userStroge.token = _user.token;
      userStroge.email = _user.email;
      localStorage.removeItem('mtAuth');
      localStorage.setItem('mtAuth', JSON.stringify(userStroge));
    }
  }

  logout() {
    localStorage.removeItem('mtAuth');
  }

}
