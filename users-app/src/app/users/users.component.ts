import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Usuario } from '../models/usuario';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  headers: HttpHeaders;
  url: string;

  idUsuario: string;
  selectedAction: string;
  searchType: string;
  printAll: boolean;

  user: Usuario = new Usuario();
  userList: Usuario[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    this.url = 'http://192.168.1.103:3010/';

    this.idUsuario = '';
    this.selectedAction = '';
    this.searchType = '';
    this.printAll = false;
  }

  async checkUser() {
    if (this.idUsuario == '') {
      alert("El campo de ID del usuario está vacío");
      return '';
    } else {
      try {
        const data = await firstValueFrom(this.http.get<any>(this.url + this.idUsuario, { headers: this.headers }));
        console.log(data);
        this.cdr.detectChanges();
        return data.rol;
      } catch (error) {
        console.error(error);
        alert("Se ha producido un error");
        return '';
      }
    }
  }

  addUser() {
    let body = {
      rol: this.user.rol
    }
    console.log("ROL: " + this.user.rol);
    if (confirm('¿Seguro que deseas crear un usuario?')) {
      this.http.post<any>(this.url, body, { headers: this.headers })
        .subscribe({
          next: data => {
            console.log("Registro:");
            console.log(data);
            this.user._id = data._id;
            this.idUsuario = this.user._id;
            this.cdr.detectChanges();
          },
          error: error => {

          }
        });
    }
  }

  async deleteUser() {
    let rol = await this.checkUser();
    if (this.user._id == this.idUsuario) {
      if (confirm('¿Seguro que deseas eliminar este usuario?')) {

        this.http.delete(this.url + this.user._id, { headers: this.headers })
          .subscribe({
            next: data => {
              console.log('Usuario eliminado con éxito');
              alert("Usuario eliminado con éxito");
            },
            error: error => {
              console.error(error);
              alert("Se ha producido un error")
            }
          });
      }
    } else {
      alert("No tienes permisos para eliminar este usuario");
    }
  }

  async listUsers() {
    if ('Admin' == await this.checkUser()) {
      if (this.searchType === 'all') {
        this.http.get<any>(this.url + "list/" + this.searchType, { headers: this.headers })
          .subscribe({
            next: data => {
              console.log(data);
              this.userList = data;
              this.cdr.detectChanges();
            },
            error: error => {
              console.error(error);
            }
          });
      } else if (this.searchType === 'cliente') {
        this.http.get<any>(this.url + "list/Cliente", { headers: this.headers })
          .subscribe({
            next: data => {
              console.log(data);
              this.userList = data;
              this.cdr.detectChanges();
            },
            error: error => {
              console.error(error);
            }
          });
      } else if (this.searchType === 'admin') {
        this.http.get<any>(this.url + "list/Admin", { headers: this.headers })
          .subscribe({
            next: data => {
              console.log(data);
              this.userList = data;
              this.cdr.detectChanges();
            },
            error: error => {
              console.error(error);
            }
          });
      }
     this.printAll = true;
     this.cdr.detectChanges();
    } else {
      alert("No tienes permisos suficientes para listar usuarios");
      this.printAll = false;
      this.cdr.detectChanges();
    }
  }

}
