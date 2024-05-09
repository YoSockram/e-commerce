import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ShopItem } from '../models/shop-item';
import { Pocion } from '../models/pocion';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  searchID: string;
  deleteID: string;
  url: string;
  data: any;
  currentIndex: number;

  printAddCorrectly: boolean;
  printResponse: boolean;
  printAll: boolean;
  printDelete: boolean;
  printFilter: boolean;

  cantidad_min: number;
  cantidad_max: number;
  duracion_min: number;
  duracion_max: number;
  nameTag: string;
  isArrojadiza: boolean;
  precio_min: number;
  precio_max: number;

  idUsuario: string;

  selectedAction = 'add';

  pocionArray: Pocion[] = [];

  savePocionItem: Pocion = new Pocion();
  getPocionItem: Pocion = new Pocion();
  updatePocionItem: Pocion = new Pocion();
  filterPocionItem: Pocion = new Pocion();

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.searchID = '';
    this.deleteID = '';
    this.url = 'http://192.168.1.103:3000/';
    this.data = '';
    this.currentIndex = 0;

    this.printAddCorrectly = false;
    this.printResponse = false;
    this.printAll = false;
    this.printDelete = false;
    this.printFilter = false;

    this.cantidad_min = 0;
    this.cantidad_max = 0;
    this.duracion_min = 0;
    this.duracion_max = 0;
    this.nameTag = '';
    this.isArrojadiza = false;
    this.precio_min = 0;
    this.precio_max = 0;

    this.idUsuario = '';

  }

  async checkUser() {
    if (this.idUsuario == '') {
      alert("El campo de ID del usuario está vacío");
      return '';
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      try {
        const data = await firstValueFrom(this.http.get<any>('http://192.168.1.103:3010/' + this.idUsuario, { headers: headers }));
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

  hideAll() {
    this.printAddCorrectly = false;
    this.printResponse = false;
    this.printAll = false;
    this.printDelete = false;
    this.printFilter = false;
    this.cdr.detectChanges();
  }

  seleccionar(i: number) {
    console.log(i);
    this.currentIndex = i;

    this.updatePocionItem.precio = this.pocionArray[i].precio;
    this.updatePocionItem.cantidad = this.pocionArray[i].cantidad;
    this.updatePocionItem.nombre = this.pocionArray[i].nombre;
    this.updatePocionItem.duracion = this.pocionArray[i].duracion;
    this.updatePocionItem.arrojadiza = this.pocionArray[i].arrojadiza;
    this.updatePocionItem.imagen = this.pocionArray[i].imagen;
    this.updatePocionItem._id = this.pocionArray[i]._id;

    this.getPocionItem.precio = this.pocionArray[i].precio;
    this.getPocionItem.cantidad = this.pocionArray[i].cantidad;
    this.getPocionItem.nombre = this.pocionArray[i].nombre;
    this.getPocionItem.duracion = this.pocionArray[i].duracion;
    this.getPocionItem.arrojadiza = this.pocionArray[i].arrojadiza;
    this.getPocionItem.imagen = this.pocionArray[i].imagen;
    this.getPocionItem._id = this.pocionArray[i]._id;

    this.searchID = this.pocionArray[i]._id;
    this.deleteID = this.pocionArray[i]._id;

    console.log(this.updatePocionItem);

    this.printAddCorrectly = false;
    this.printResponse = true;
    this.printAll = false;
    this.printDelete = false;
    this.printFilter = false;

    this.cdr.detectChanges();

  }

  async postInBD() {
    let userRole = await this.checkUser();
    if (userRole == 'Admin') {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      console.log(this.savePocionItem);
      const body = {
        precio: this.savePocionItem.precio,
        cantidad: this.savePocionItem.cantidad,
        nombre: this.savePocionItem.nombre,
        duracion: this.savePocionItem.duracion,
        arrojadiza: this.savePocionItem.arrojadiza,
        imagen: this.savePocionItem.imagen
      };

      this.http.post<any>(this.url, body, { headers: headers })
        .subscribe({
          next: data => {
            console.log(data);

            this.printDelete = false;
            this.printResponse = false;
            this.printAll = false;
            this.printAddCorrectly = true;

            this.cdr.detectChanges();
          },
          error: error => {
            alert("Error al añadir un objeto");
            console.error(error);
          }
        });
    } else {
      alert("No tienes permisos para realizar esta petición");
      this.hideAll();
    }
  }

  async getAll() {
    let userRole = await this.checkUser();
    if (userRole == 'Admin') {
      this.pocionArray = [];
      this.hideAll();
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      this.http.get<any>(this.url, { headers: headers })
        .subscribe({
          next: data => {
            console.log(data);

            this.pocionArray = data;

            this.printDelete = false;
            this.printAddCorrectly = false;
            this.printResponse = false;
            this.printFilter = false;
            this.printAll = true;

            this.getPocionItem.precio = this.pocionArray[this.currentIndex].precio;
            this.getPocionItem.cantidad = this.pocionArray[this.currentIndex].cantidad;
            this.getPocionItem.nombre = this.pocionArray[this.currentIndex].nombre;
            this.getPocionItem.duracion = this.pocionArray[this.currentIndex].duracion;
            this.getPocionItem.arrojadiza = this.pocionArray[this.currentIndex].arrojadiza;
            this.getPocionItem.imagen = this.pocionArray[this.currentIndex].imagen;
            this.getPocionItem._id = this.pocionArray[this.currentIndex]._id;

            this.cdr.detectChanges();

          },
          error: error => {
            console.error(error);
            alert("Se ha producido un error");
          }
        });
    } else {
      alert("No tienes permisos para realizar esta petición");
      this.hideAll();
    }
  }

  async searchByID() {
    let userRole = await this.checkUser();
    if (userRole == 'Admin') {
      this.pocionArray = [];
      this.hideAll();
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      this.http.get<any>(this.url + this.searchID, { headers: headers })
        .subscribe({
          next: data => {
            console.log(data);

            this.printDelete = false;
            this.printAddCorrectly = false;
            this.printAll = false;
            this.printFilter = false;
            this.printResponse = true;

            console.log(JSON.stringify(data));

            this.getPocionItem.precio = data[0].precio;
            this.getPocionItem.cantidad = data[0].cantidad;
            this.getPocionItem.nombre = data[0].nombre;
            this.getPocionItem.duracion = data[0].duracion;
            this.getPocionItem.arrojadiza = data[0].arrojadiza;
            this.getPocionItem.imagen = data[0].imagen;
            this.getPocionItem._id = data[0]._id;

            this.cdr.detectChanges();
          },
          error: error => {
            if (error.status === 404) {
              alert("No se encuentra la ID");
            } else {
              console.error(error);
              alert("Se ha producido un error");
            }
          }
        });
    } else {
      alert("No tienes permisos para realizar esta petición");
      this.hideAll();
    }
  }

  update(t: number) {

    // if (t == 0) {
    this.selectedAction = "update";
    // }
    this.updatePocionItem.precio = this.pocionArray[this.currentIndex].precio;
    this.updatePocionItem.cantidad = this.pocionArray[this.currentIndex].cantidad;
    this.updatePocionItem.nombre = this.pocionArray[this.currentIndex].nombre;
    this.updatePocionItem.duracion = this.pocionArray[this.currentIndex].duracion;
    this.updatePocionItem.arrojadiza = this.pocionArray[this.currentIndex].arrojadiza;
    this.updatePocionItem.imagen = this.pocionArray[this.currentIndex].imagen;
    this.updatePocionItem._id = this.pocionArray[this.currentIndex]._id;
    this.cdr.detectChanges();

  }

  async putInBD() {
    let userRole = await this.checkUser();
    if (userRole == 'Admin') {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      const body = {
        precio: this.updatePocionItem.precio,
        cantidad: this.updatePocionItem.cantidad,
        nombre: this.updatePocionItem.nombre,
        duracion: this.updatePocionItem.duracion,
        arrojadiza: this.updatePocionItem.arrojadiza,
        imagen: this.updatePocionItem.imagen,
        _id: this.updatePocionItem._id
      };

      this.http.put<any>(this.url, body, { headers: headers })
        .subscribe({
          next: data => {
            console.log(data);
            alert("Objeto actualizado correctamente")
          },
          error: error => {
            if (error.status === 409) {
              alert("ID duplicada");
              console.error(error);
            } else {
              console.error(error);
              alert("Se ha producido un error");
            }
          }
        });
    } else {
      alert("No tienes permisos para realizar esta petición");
      this.hideAll();
    }
  }

  async deleteItem() {
    let userRole = await this.checkUser();
    if (userRole == 'Admin') {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      this.http.delete<any>(this.url + this.deleteID, { headers: headers })
        .subscribe({
          next: data => {
            alert("Objeto eliminado correctamente")
          },
          error: error => {
            if (error.status === 404) {
              alert("No se encuentra la ID");
              console.error(error)
            } else {
              console.error(error)
              alert("Se ha producido un error");
            }
          }
        });
    } else {
      alert("No tienes permisos para realizar esta petición");
      this.hideAll();
    }
  }

  async filterData(type: number) {
    let userRole = await this.checkUser();
    if (userRole == 'Admin') {
      this.pocionArray = [];
      this.hideAll();

      let filteredData: Pocion[] = [];
      let params;

      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

      console.log("TYPE: " + type);
      switch (type) {
        case 1:
          params = new HttpParams()
            .set('nombre', this.nameTag);

          this.http.get<any>(this.url + "filter/" + type, { headers: headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.currentIndex = 0;
                this.pocionArray = filteredData;

                this.printDelete = false;
                this.printAddCorrectly = false;
                this.printAll = false;
                this.printResponse = false;
                this.printFilter = true;

                this.cdr.detectChanges();
              },
              error: error => {
                alert("Ha habido un problema con la solicitud");
                console.error(error);
              }
            });
          break;
        case 2:
          params = new HttpParams()
            .set('isArrojadiza', this.isArrojadiza);

          this.http.get<any>(this.url + "filter/" + type, { headers: headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.currentIndex = 0;
                this.pocionArray = filteredData;

                this.printDelete = false;
                this.printAddCorrectly = false;
                this.printAll = false;
                this.printResponse = false;
                this.printFilter = true;

                this.cdr.detectChanges();
              },
              error: error => {
                alert("Ha habido un problema con la solicitud");
                console.error(error);
              }
            });
          break;

        case 3:
          params = new HttpParams()
            .set('minCantidad', this.cantidad_min.toString())
            .set('maxCantidad', this.cantidad_max.toString());

          this.http.get<any>(this.url + "filter/" + type, { headers: headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.currentIndex = 0;
                this.pocionArray = filteredData;

                this.printDelete = false;
                this.printAddCorrectly = false;
                this.printAll = false;
                this.printResponse = false;
                this.printFilter = true;

                this.cdr.detectChanges();
              },
              error: error => {
                alert("Ha habido un problema con la solicitud");
                console.error(error);
              }
            });
          break;

        case 4:
          params = new HttpParams()
            .set('minDuration', this.duracion_min.toString())
            .set('maxDuration', this.duracion_max.toString());

          this.http.get<any>(this.url + "filter/" + type, { headers: headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.currentIndex = 0;
                this.pocionArray = filteredData;

                this.printDelete = false;
                this.printAddCorrectly = false;
                this.printAll = false;
                this.printResponse = false;
                this.printFilter = true;

                this.cdr.detectChanges();
              },
              error: error => {
                alert("Ha habido un problema con la solicitud");
                console.error(error);
              }
            });
          break;
        case 5:
          params = new HttpParams()
            .set('minPrecio', this.precio_min.toString())
            .set('maxPrecio', this.precio_max.toString());

          this.http.get<any>(this.url + "filter/" + type, { headers: headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.currentIndex = 0;
                this.pocionArray = filteredData;

                this.printDelete = false;
                this.printAddCorrectly = false;
                this.printAll = false;
                this.printResponse = false;
                this.printFilter = true;

                this.cdr.detectChanges();
              },
              error: error => {
                alert("Ha habido un problema con la solicitud");
                console.error(error);
              }
            });
          break;
        default:
          break;
      }
    } else {
      alert("No tienes permisos para realizar esta petición");
      this.hideAll();
    }
  }
}