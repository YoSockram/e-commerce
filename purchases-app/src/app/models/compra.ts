import { Pocion } from "./pocion";

export class Compra {
    public _id!: string;
    public id_item!: string;
    public id_user!: string;
    public nombre_item!: string;
    public nombre_client!: string;
    public cantidad!: number;
    public direccion!: string;
    public item!: Pocion[]; // campo para almacenar los detalles del artículo
}
