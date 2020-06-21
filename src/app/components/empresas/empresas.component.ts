import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Empresa } from "../../models/empresa";
import { EmpresasService } from "../../services/empresas.service";

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.css"]
})
export class EmpresasComponent implements OnInit {
  FormReg: FormGroup;

  Titulo = "Listado de Empresas";
  Items: Empresa[] = [];

  AccionABMC = "L";
  Estado: string;

  constructor(
    private formBuilder: FormBuilder,
    private empresasService: EmpresasService
  ) {}

  ngOnInit() {
    this.GetEmpresas();

    this.FormReg = this.formBuilder.group({
      CantidadEmpleados: ["", [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      FechaFundacion: ["", [Validators.required, Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      IdEmpresa: [0],
      RazonSocial: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      
      /* Activo: [true] */
    });
  }

  GetEmpresas() {
    this.empresasService.get().subscribe((res: any) => {
      this.Items = res;
    });
  }

  Editar(item) {
    this.BuscarPorId(item);
    this.AccionABMC = "E";
    this.Estado = "Edicion";
  }

  BuscarPorId(item) {
    /* window.scroll(0, 0); */ // ir al incio del scroll
    this.empresasService.getById(item.IdEmpresa).subscribe((res: any) => {
      const itemCopy = { ...res }; // hacemos copia para no modificar el array original del mock

      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
      var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split("-");
      itemCopy.FechaFundacion =
        arrFecha[2] + "/" + arrFecha[1] + "/" + arrFecha[0];
      this.FormReg.patchValue(itemCopy);
    });
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    /* this.submitted = true; */
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaFundacion = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (itemCopy.IdEmpresa == 0 || itemCopy.IdEmpresa == null) {
      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        /* this.modalDialogService.Alert('Registro agregado correctamente.'); */
        this.Volver();
        this.GetEmpresas();
      });
    } else {
      // modificar put
      this.empresasService
        .put(itemCopy.IdEmpresa, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.GetEmpresas();
        });
    }
  }
}
