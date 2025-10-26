import { DetProductModel } from "./DetProductModel";

export interface MovModel {
    id_operacion: number,
    cod_cliente: number,
    det: DetProductModel[]
}