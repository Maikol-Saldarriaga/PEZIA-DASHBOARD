import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DasboardProductionComponent } from './dasboard-production/dasboard-production.component';
import { RouterModule, Routes } from '@angular/router';
import { OxigenoComponent } from './oxigeno/oxigeno.component';
import { PHComponent } from './p-h/p-h.component';
import { WeightDashboardComponent } from './weight-dashboard/weight-dashboard.component';
import { TemperaturaComponent } from './temperatura/temperatura.component';
import { MortalidadComponent } from './mortalidad/mortalidad.component';
import { MedicacionAlimentacionComponent } from './medicacion-alimentacion/medicacion-alimentacion.component';




const routes: Routes = [
  
  //ruta del path de inicio (carga todos los componentes)
  { path: 'Inicio', component: DasboardProductionComponent },
  { path: '', redirectTo: '/Inicio', pathMatch: 'full'},

];



@NgModule({
  declarations: [
    AppComponent,
    DasboardProductionComponent,
    OxigenoComponent,
    PHComponent,
    WeightDashboardComponent,
    TemperaturaComponent,
    MortalidadComponent,
    MedicacionAlimentacionComponent   // t
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
