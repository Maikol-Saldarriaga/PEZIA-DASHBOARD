import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

interface DeviceInfo {
  id: string;
  name: string;
  status: string;
}

// Constantes para fácil configuración
const OXYGEN_RANGES = {
  MALO: { min: 1, max: 3 },
  REGULAR: { min: 3, max: 4 },
  OPTIMO: { min: 4, max: 13 }
};

const DEVICE_STATUS = {
  CONNECTED: 'Conectado',
  DISCONNECTED: 'Desconectado'
};


@Component({
  selector: 'app-oxigeno',
  templateUrl: './oxigeno.component.html',
  styleUrls: ['./oxigeno.component.css']
})
export class OxigenoComponent implements OnInit{
  timeRange: number = 7;
  currentOxygen: number = 3;
  readonly IDEAL_OXYGEN = 9;
  readonly MAX_DEVIATION = 6;

  deviceInfo: DeviceInfo = {
    id: "XXXXXXXX",
    name: "Nombre X",
    status: DEVICE_STATUS.DISCONNECTED
  };

  constructor() { }

  ngOnInit() {
    this.generateMockData(this.timeRange);
    this.drawChart();
  }

  getProgressPercentage(): number {
    const maxValue = OXYGEN_RANGES.OPTIMO.max;
    const minValue = OXYGEN_RANGES.MALO.min;
    const currentValue = this.currentOxygen;
    const progress = ((currentValue - minValue) / (maxValue - minValue)) * 100;
    return Math.round(Math.max(0, Math.min(100, progress)));
  }

  getProgressColor(): string {
    if (this.currentOxygen >= OXYGEN_RANGES.MALO.min && this.currentOxygen <= OXYGEN_RANGES.MALO.max) 
      return '#ef4444'; // Malo: 1-3
    if (this.currentOxygen > OXYGEN_RANGES.REGULAR.min && this.currentOxygen <= OXYGEN_RANGES.REGULAR.max) 
      return '#3b82f6'; // Regular: 3-4
    return '#22c55e'; // Óptimo: 4-13
  }

  getOxygenStatus() {
    if (this.currentOxygen >= OXYGEN_RANGES.MALO.min && this.currentOxygen <= OXYGEN_RANGES.MALO.max) {
      return { color: 'text-red-500', label: 'Malo' };
    }
    if (this.currentOxygen > OXYGEN_RANGES.REGULAR.min && this.currentOxygen <= OXYGEN_RANGES.REGULAR.max) {
      return { color: 'text-blue-500', label: 'Regular' };
    }
    return { color: 'text-green-500', label: 'Óptimo' };
  }

  toggleDeviceConnection() {
    // En el futuro, aquí irá la lógica de conexión real con el backend
    this.deviceInfo.status = this.deviceInfo.status === DEVICE_STATUS.CONNECTED 
      ? DEVICE_STATUS.DISCONNECTED 
      : DEVICE_STATUS.CONNECTED;
  }

  isDeviceConnected(): boolean {
    return this.deviceInfo.status === DEVICE_STATUS.CONNECTED;
  }

  onTimeRangeChange(days: number) {
    this.timeRange = days;
    this.generateMockData(days);
    this.drawChart();
  }

  private generateMockData(days: number) {
    const data = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      // Generar valores aleatorios entre el rango mínimo y máximo total
      const randomValue = Math.random() * (OXYGEN_RANGES.OPTIMO.max - OXYGEN_RANGES.MALO.min) + OXYGEN_RANGES.MALO.min;

      data.push({
        date: new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000),
        value: parseFloat(randomValue.toFixed(1))
      });
    }

    if (data.length > 0) {
      this.currentOxygen = parseFloat(data[data.length - 1].value.toFixed(1));
    }

    return data;
  }

  private drawChart() {
    const data = this.generateMockData(this.timeRange);
    d3.select('#oxygen-chart').selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 650 - margin.left - margin.right;
    const height = 370 - margin.top - margin.bottom;

    const svg = d3.select('#oxygen-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .range([height, 0]);

    const line = d3.line<any>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#222867')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(this.timeRange <= 7 ? data.length : 7)
        .tickFormat(d => d3.timeFormat('%d/%m')(d as Date)));

    svg.append('g')
      .call(d3.axisLeft(y));
  }
}