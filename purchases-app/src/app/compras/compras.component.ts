import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Compra } from '../models/compra';
import { firstValueFrom } from 'rxjs';
import { Pocion } from '../models/pocion';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {

  headers: HttpHeaders;
  url: string;
  url_items: string;
  url_users: string;

  idUsuario: string;
  selectedAction: string;

  printAddCorrectly: boolean;
  printResponse: boolean;
  printAll: boolean;
  printDelete: boolean;
  printFilter: boolean;
  printPurchases: boolean;
  printPurchase: boolean;

  id_compra: string;
  searchID: string;
  cantidad_min: number;
  cantidad_max: number;
  duracion_min: number;
  duracion_max: number;
  nameTag: string;
  isArrojadiza: boolean;
  precio_min: number;
  precio_max: number;
  item_index: number;
  compra_index: number;

  nombre_cliente: string;
  id_cliente: string;
  cantidad_minima: number;
  cantidad_maxima: number;

  purchase: Compra = new Compra();
  updatePurchase: Compra = new Compra();
  purchaseList: Compra[] = [];

  // pocion: Pocion = new Pocion();
  getPocionItem: Pocion = new Pocion();
  pocionArray: Pocion[] = [];


  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    this.url = 'http://192.168.1.103:3020/';
    this.url_items = 'http://192.168.1.103:3000/';
    this.url_users = 'http://192.168.1.103:3010/';

    this.idUsuario = '';
    this.selectedAction = '';

    this.printAddCorrectly = false;
    this.printResponse = false;
    this.printAll = false;
    this.printDelete = false;
    this.printFilter = false;
    this.printPurchases = false;
    this.printPurchase = false;

    this.id_compra = '';
    this.searchID = '';
    this.cantidad_min = 0;
    this.cantidad_max = 0;
    this.duracion_min = 0;
    this.duracion_max = 0;
    this.nameTag = '';
    this.isArrojadiza = false;
    this.precio_min = 0;
    this.precio_max = 0;
    this.item_index = 0;
    this.compra_index = 0;

    this.nombre_cliente = '';
    this.cantidad_maxima = 0;
    this.cantidad_minima = 0;
    this.id_cliente = '';
  }

  async checkUser() {
    if (this.idUsuario == '') {
      alert("El campo de ID del usuario está vacío");
      return '';
    } else {
      try {
        const data = await firstValueFrom(this.http.get<any>(this.url_users + this.idUsuario, { headers: this.headers }));
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
    this.printPurchases = false;
    this.printPurchase = false;
    this.cdr.detectChanges();
  }

  seleccionar(i: number) {
    console.log(i);
    this.item_index = i;

    this.getPocionItem.precio = this.pocionArray[i].precio;
    this.getPocionItem.cantidad = this.pocionArray[i].cantidad;
    this.getPocionItem.nombre = this.pocionArray[i].nombre;
    this.getPocionItem.duracion = this.pocionArray[i].duracion;
    this.getPocionItem.arrojadiza = this.pocionArray[i].arrojadiza;
    this.getPocionItem.imagen = this.pocionArray[i].imagen;
    this.getPocionItem._id = this.pocionArray[i]._id;

    this.printAddCorrectly = false;
    this.printResponse = true;
    this.printAll = false;
    this.printDelete = false;
    this.printFilter = false;
    this.printPurchases = false;
    this.printPurchase = false;

    this.cdr.detectChanges();

  }

  seleccionar_compra(i: number) {
    console.log(i);
    this.compra_index = i;

    this.updatePurchase._id = this.purchaseList[i]._id;
    this.updatePurchase.cantidad = this.purchaseList[i].cantidad;
    this.updatePurchase.direccion = this.purchaseList[i].direccion;
    this.updatePurchase.id_item = this.purchaseList[i].id_item;
    this.updatePurchase.id_user = this.purchaseList[i].id_user;
    this.updatePurchase.nombre_client = this.purchaseList[i].nombre_client;
    this.updatePurchase.nombre_item = this.purchaseList[i].nombre_item;

    this.getPocionItem = this.purchaseList[i].item[0];

    this.printAddCorrectly = false;
    this.printResponse = false;
    this.printAll = false;
    this.printDelete = false;
    this.printFilter = false;
    this.printPurchases = false;
    this.printPurchase = true;

    this.cdr.detectChanges();

  }

  async getAll() {
    this.pocionArray = [];
    this.hideAll();

    let rol = await this.checkUser();

    if (rol == 'Cliente' || this.idUsuario == '') {
      this.http.get<any>(this.url_items, { headers: this.headers })
        .subscribe({
          next: data => {
            console.log(data);

            this.pocionArray = data;

            this.printDelete = false;
            this.printAddCorrectly = false;
            this.printResponse = false;
            this.printFilter = false;
            this.printPurchases = false;
            this.printPurchase = false;
            this.printAll = true;

            this.getPocionItem.precio = this.pocionArray[this.item_index].precio;
            this.getPocionItem.cantidad = this.pocionArray[this.item_index].cantidad;
            this.getPocionItem.nombre = this.pocionArray[this.item_index].nombre;
            this.getPocionItem.duracion = this.pocionArray[this.item_index].duracion;
            this.getPocionItem.arrojadiza = this.pocionArray[this.item_index].arrojadiza;
            this.getPocionItem.imagen = this.pocionArray[this.item_index].imagen;
            this.getPocionItem._id = this.pocionArray[this.item_index]._id;

            this.cdr.detectChanges();

          },
          error: error => {
            console.error(error);
            alert("Se ha producido un error");
          }
        });
    } else {
      alert("No puedes realizar esta operación");
    }
  }

  async searchByID() {
    let userRole = await this.checkUser();
    if (userRole == 'Cliente') {
      this.pocionArray = [];
      this.hideAll();
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      this.http.get<any>(this.url_items + this.searchID, { headers: headers })
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

  async filterData(type: number) {
    this.pocionArray = [];
    this.hideAll();

    let filteredData: Pocion[] = [];
    let params;

    let rol = await this.checkUser();

    console.log("TYPE: " + type);
    if (rol == 'Cliente') {
      switch (type) {
        case 1:
          params = new HttpParams()
            .set('nombre', this.nameTag);

          this.http.get<any>(this.url_items + "filter/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.item_index = 0;
                this.pocionArray = filteredData;

                this.printDelete = false;
                this.printAddCorrectly = false;
                this.printAll = false;
                this.printResponse = false;
                this.printPurchases = false;
                this.printPurchase = false;
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

          this.http.get<any>(this.url_items + "filter/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.item_index = 0;
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

          this.http.get<any>(this.url_items + "filter/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.item_index = 0;
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

          this.http.get<any>(this.url_items + "filter/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.item_index = 0;
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

          this.http.get<any>(this.url_items + "filter/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                filteredData = data;
                console.log(filteredData);

                this.item_index = 0;
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
    }
  }

  buyItem() {

    const body_post = {
      id_item: this.getPocionItem._id,
      id_user: this.idUsuario,
      nombre_item: this.getPocionItem.nombre,
      nombre_comprador: this.purchase.nombre_client,
      cantidad: this.purchase.cantidad,
      direccion: this.purchase.direccion
    };

    let cantidad_final = this.getPocionItem.cantidad - this.purchase.cantidad;

    if (cantidad_final >= 0) {
      const body_put = {
        precio: this.getPocionItem.precio,
        cantidad: cantidad_final,
        nombre: this.getPocionItem.nombre,
        duracion: this.getPocionItem.duracion,
        arrojadiza: this.getPocionItem.arrojadiza,
        imagen: this.getPocionItem.imagen,
        _id: this.getPocionItem._id
      }

      this.http.put<any>(this.url_items, body_put, { headers: this.headers })
        .subscribe({
          next: data => {
            console.log(data);
            // alert("Objeto actualizado correctamente")
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

      this.http.post<any>(this.url, body_post, { headers: this.headers })
        .subscribe({
          next: data => {
            console.log(data);

            alert("Compra registrada");

            this.id_compra = data.purchaseId;

            this.printDelete = false;
            this.printResponse = false;
            this.printAll = false;
            this.printPurchases = false;
            this.printPurchase = false;
            this.printAddCorrectly = true;

            this.cdr.detectChanges();
          },
          error: error => {
            alert("Error al añadir un objeto");
            console.error(error);
          }
        });
    } else {
      alert("No hay suficientes unidades de la poción elegida")
    }
  }

  async getPurchases(type: number) {

    let rol = await this.checkUser();
    let params;
    this.id_cliente = this.idUsuario;

    if (rol == 'Cliente') {

      switch (type) {
        // Buscar todas las compras del usuario
        case 1:
          params = new HttpParams()
            .set('id_cliente', this.id_cliente);

          this.http.get<any>(this.url + "compra/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                console.log(data);
                this.purchaseList = data.purchases;
                console.log("Compras " + this.purchaseList);

                this.printAddCorrectly = false;
                this.printResponse = false;
                this.printAll = false;
                this.printDelete = false;
                this.printFilter = false;
                this.printPurchases = true;
                this.printPurchase = false;
                this.cdr.detectChanges();
              },
              error: error => {
                console.error(error);
                alert("Error al obtener las compras");
              }
            });

          break;

        // Buscar todas las compras del usuario con un nombre determinado
        case 2:
          params = new HttpParams()
            .set('id_cliente', this.id_cliente)
            .set('nombre_cliente', this.nombre_cliente);

          this.http.get<any>(this.url + "compra/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                console.log(data);
                this.purchaseList = data.purchases;
                console.log("Compras " + this.purchaseList);

                this.printAddCorrectly = false;
                this.printResponse = false;
                this.printAll = false;
                this.printDelete = false;
                this.printFilter = false;
                this.printPurchases = true;
                this.printPurchase = false;
                this.cdr.detectChanges();
              },
              error: error => {
                console.error(error);
                alert("Error al obtener las compras");
              }
            });
          break;

        // Buscar todas las compras de un usuario con un rango de cantidad especifico
        case 3:
          params = new HttpParams()
            .set('id_cliente', this.id_cliente)
            .set('cantidad_minima', this.cantidad_minima)
            .set('cantidad_maxima', this.cantidad_maxima);

          this.http.get<any>(this.url + "compra/" + type, { headers: this.headers, params: params })
            .subscribe({
              next: data => {
                console.log(data);
                this.purchaseList = data.purchases;
                console.log("Compras " + this.purchaseList);

                this.printAddCorrectly = false;
                this.printResponse = false;
                this.printAll = false;
                this.printDelete = false;
                this.printFilter = false;
                this.printPurchases = true;
                this.printPurchase = false;
                this.cdr.detectChanges();
              },
              error: error => {
                console.error(error);
                alert("Error al obtener las compras");
              }
            });
            break;

        case 4:

          break;

        default:
          break;
      }
    }
  }

  async updateCompra() {
    let rol = await this.checkUser();

    const body_put = {
      _id: this.updatePurchase._id,
      id_item: this.updatePurchase.id_item,
      id_user: this.updatePurchase.id_user,
      nombre_item: this.updatePurchase.nombre_item,
      nombre_client: this.updatePurchase.nombre_client,
      cantidad: this.updatePurchase.cantidad,
      direccion: this.updatePurchase.direccion
    };

    if (rol == 'Cliente' && confirm("¿Quiere modificar los datos de su compra?")) {
      this.http.put<any>(this.url, body_put, { headers: this.headers })
        .subscribe({
          next: data => {
            console.log(data);
            alert("Compra actualizada");
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
    }
  }

  async deleteCompra() {
    let rol = await this.checkUser();

    if (rol == 'Cliente' && confirm("¿Quiere eliminar la compra?")) {
      if (this.idUsuario == this.updatePurchase.id_user) {

        let cantidad_final = this.getPocionItem.cantidad + this.updatePurchase.cantidad;

        this.http.delete(this.url + this.updatePurchase._id, { headers: this.headers })
          .subscribe({
            next: data => {
              console.log('Compra eliminada con éxito');
              alert("Compra eliminada con éxito");
            },
            error: error => {
              console.error(error);
              alert("Se ha producido un error")
            }
          });

        const body_put = {
          precio: this.getPocionItem.precio,
          cantidad: cantidad_final,
          nombre: this.getPocionItem.nombre,
          duracion: this.getPocionItem.duracion,
          arrojadiza: this.getPocionItem.arrojadiza,
          imagen: this.getPocionItem.imagen,
          _id: this.getPocionItem._id
        }

        this.http.put<any>(this.url_items, body_put, { headers: this.headers })
          .subscribe({
            next: data => {
              console.log(data);
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
        alert("No puede eliminar una compra que no le pertenece")
      }
    }
  }

}
