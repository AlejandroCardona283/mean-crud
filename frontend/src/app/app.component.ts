import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, BaseChartDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  correo = "";
  password = "";
  logueado = false;
  registrado = false;
  user$: Observable<User | null>;
  usuarioActual: any;

  nombre = "";
  consumoDiario = 0;
  dias = 30;
  tarifa = 0;
  consumoMensual = 0;
  costoMensual = 0;
  clasificacion = "";
  editandoId: any = null;

  // 🔥 CAMBIO AQUÍ (API NODE)
  apiUrl = 'https://mean-crud-production.up.railway.app/api/items';

  historial: any[] = [];
  ultimaFecha = "";

  constructor(private auth: Auth, private http: HttpClient){
    this.user$ = authState(this.auth);

    this.user$.subscribe(user=>{
      if(user){
        this.logueado = true;
        this.usuarioActual = user;
        this.cargarDatos();
      }
    });
  }

  async login(){
    if(this.correo && this.password){
      await signInWithEmailAndPassword(this.auth,this.correo,this.password);
    }
  }

  async loginGoogle(){
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth,provider);
  }

  async registrar(){
    if(!this.correo || !this.password) return;
    await createUserWithEmailAndPassword(this.auth,this.correo,this.password);
    await signOut(this.auth);
    this.password = '';
  }

  async cerrarSesion(){
    await signOut(this.auth);
    this.logueado = false;
    this.usuarioActual = null;
    this.historial = [];
  }

  calcular(){
    this.consumoMensual = this.consumoDiario * this.dias;
    this.costoMensual = this.consumoMensual * this.tarifa;

    if(this.consumoMensual < 150){
      this.clasificacion = "Bajo";
    } else if(this.consumoMensual <= 300){
      this.clasificacion = "Medio";
    } else{
      this.clasificacion = "Alto";
    }
  }

  // 🔥 GET desde Node
  cargarDatos(){
    this.http.get<any[]>(this.apiUrl).subscribe(data=>{

      this.historial = data.filter(
        r => r.correo === this.usuarioActual.email
      );

      if(this.historial.length > 0){
        this.ultimaFecha = this.historial[this.historial.length - 1].createdAt;
      }

      this.generarGrafica();
    });
  }

  // 🔥 POST / PUT
  guardar(){
    let registro: any = {
      nombre:this.nombre,
      correo:this.usuarioActual.email,
      consumoDiario:this.consumoDiario,
      dias:this.dias,
      tarifa:this.tarifa,
      consumoMensual:this.consumoMensual,
      costoMensual:this.costoMensual,
      clasificacion:this.clasificacion
    };

    if(this.editandoId){

      this.http.put(`${this.apiUrl}/${this.editandoId}`, registro)
        .subscribe(()=> this.cargarDatos());

      this.editandoId = null;

    }else{

      this.http.post(this.apiUrl, registro)
        .subscribe(()=> this.cargarDatos());

    }
  }

  // 🔥 DELETE
  borrar(id:string){
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(()=> this.cargarDatos());
  }

  editar(r:any){
    this.editandoId = r._id; // 🔥 CAMBIO

    this.nombre = r.nombre;
    this.consumoDiario = r.consumoDiario;
    this.dias = r.dias;
    this.tarifa = r.tarifa;
    this.consumoMensual = r.consumoMensual;
    this.costoMensual = r.costoMensual;
    this.clasificacion = r.clasificacion;
  }

  pieChartLabels: string[] = ['Bajo','Medio','Alto'];
  pieChartData = [
    { data:[0,0,0], backgroundColor:[ '#ff4d4d', '#ffd633', '#28a745' ] }
  ];
  pieChartType: ChartType = 'pie';

  barChartLabels: string[] = [];
  barChartData = [
    { data: [] as number[], label: 'Costo mensual (€)' }
  ];
  barChartType: ChartType = 'bar';

  generarGrafica(){
    let bajo = 0, medio = 0, alto = 0;

    let costos: number[] = [];
    let nombres: string[] = [];

    this.historial.forEach(r=>{
      if(r.clasificacion === "Bajo") bajo++;
      if(r.clasificacion === "Medio") medio++;
      if(r.clasificacion === "Alto") alto++;

      costos.push(Number(r.costoMensual));
      nombres.push(r.nombre);
    });

    this.pieChartData = [
      { data:[bajo,medio,alto], backgroundColor:[ '#ff4d4d', '#ffd633', '#28a745' ] }
    ];

    this.barChartLabels = nombres;
    this.barChartData = [
      { data: costos, label: 'Costo mensual (€)' }
    ];
  }
}