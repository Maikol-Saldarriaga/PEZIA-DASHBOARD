import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";


interface Tank {
  id: number;
  name: string;
  tankId: string;
  volume: number;
  fillPercentage: number;
  depth: number;
  status: string;
}

interface Batch {
  id: number;
  batchId: string;
  tankId: number;
  species: string;
  count: number;
  createdAt: Date;
  status: string;
}

interface Temperature {
  id: number;
  tankId: number;
  temperature: number;
  timestamp: Date;
}


@Component({
  selector: 'app-temperatura',
  templateUrl: './temperatura.component.html',
  styleUrls: ['./temperatura.component.css']
})

export class TemperaturaComponent implements OnInit{
  timeRange: number = 7;
  currentTemp: number = 29.5;
  readonly IDEAL_TEMP = 29;
  readonly MAX_DEVIATION = 8;

  // Método para generar datos mock variados que muestren diferentes estados
  generateMockData(days: number) {
    this.temperatures = [];
    const now = new Date();

    // Función auxiliar para generar temperaturas variadas
    const generateTemp = (i: number) => {
      // Generamos temperaturas que cubran los tres rangos:
      // Frío: < 25°C
      // Óptimo: 25-33°C
      // Malo: > 33°C
      const ranges = [
        () => 20 + Math.random() * 4,    // Frío: 20-24°C
        () => 25 + Math.random() * 8,    // Óptimo: 25-33°C
        () => 34 + Math.random() * 4     // Malo: 34-38°C
      ];

      // Seleccionar un rango aleatorio para más variedad
      const rangeIndex = Math.floor(Math.random() * ranges.length);
      return ranges[rangeIndex]();
    };

    for (let i = 0; i < days; i++) {
      this.temperatures.push({
        id: i + 1,
        tankId: 1,
        temperature: generateTemp(i),
        timestamp: new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000)
      });
    }

    if (this.temperatures.length > 0) {
      this.currentTemp = parseFloat(this.temperatures[this.temperatures.length - 1].temperature.toFixed(1));
    }
  }

  tank: Tank = {
    id: 1,
    name: "Estanque 1",
    tankId: "E001",
    volume: 8,
    fillPercentage: 100,
    depth: 1,
    status: "Ocupado"
  };

  batch: Batch = {
    id: 1,
    batchId: "PS001",
    tankId: 1,
    species: "Tilapia Roja",
    count: 2000,
    createdAt: new Date(),
    status: "Sembrado"
  };

  temperatures: Temperature[] = [];

  constructor() {
    this.generateMockData(7);
  }

  ngOnInit() {
    this.drawChart();
  }

  onTimeRangeChange(days: number) {
    this.timeRange = days;
    this.generateMockData(days);
    this.drawChart();
  }

  getTemperatureStatus() {
    if (this.currentTemp < 25) return { color: 'text-blue-500', label: 'Baja' };
    if (this.currentTemp > 33) return { color: 'text-red-500', label: 'Alta' };
    return { color: 'text-green-500', label: 'Óptima' };
  }

  getProgressPercentage(): number {
    const deviation = Math.abs(this.currentTemp - this.IDEAL_TEMP);
    const progress = Math.max(0, 100 - (deviation / this.MAX_DEVIATION) * 100);
    return Math.round(progress);
  }

  getProgressColor(): string {
    if (this.currentTemp < 25) return '#3b82f6'; // blue-500
    if (this.currentTemp > 33) return '#ef4444'; // red-500
    return '#22c55e'; // green-500
  }

  private drawChart() {
    d3.select('#temperature-chart').selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select('#temperature-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(this.temperatures, d => d.timestamp) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.temperatures, d => d.temperature) as number])
      .range([height, 0]);

    const line = d3.line<Temperature>()
      .x(d => x(d.timestamp))
      .y(d => y(d.temperature))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(this.temperatures)
      .attr('fill', 'none')
      .attr('stroke', '#222867')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.selectAll('.point')
      .data(this.temperatures)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.temperature))
      .attr('r', 4)
      .attr('fill', '#222867');

    // Configurar el número de ticks según el rango de tiempo
    const tickCount = this.timeRange <= 7 ? this.temperatures.length :
      this.timeRange <= 30 ? 7 :
        12; // Para 3 meses

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(tickCount)
        .tickFormat(d => d3.timeFormat('%d/%m')(d as Date)));

    svg.append('g')
      .call(d3.axisLeft(y));
  }
}