import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
import { Empresa } from "../models/empresa";

@Injectable({
  providedIn: "root"
})
export class EmpresasService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    // la barra al final del resourse url es importante para los metodos que concatenan el id del recurso (GetById, Put)
    this.resourceUrl = "https://pavii.ddns.net/api/empresas/";
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  post(obj:Empresa) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  put(Id: number, obj:Empresa) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

 /*  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  } */
  
  }
