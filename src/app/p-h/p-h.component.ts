import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface PhReading {
  id: number;
  value: number;
  timestamp: Date;
}

@Component({
  selector: 'app-p-h',
  templateUrl: './p-h.component.html',
  styleUrls: ['./p-h.component.css']
})
export class PHComponent implements OnInit {
  timeRange: number = 7;
  currentPh: number = 7;
  phReadings: PhReading[] = [];

  readonly PH_COLORS = [
    '#FF0000', // pH 0 - Rojo muy ácido
    '#FF1E00', // pH 1
    '#FF3C00', // pH 2
    '#FF5A00', // pH 3
    '#FF7800', // pH 4
    '#aac939c4', // pH 5
    '#7bb662c4', // pH 6
    '#7BB661', // pH 7 - Verde neutro
    '#00BFFF', // pH 8
    '#0096FF', // pH 9
    '#006EFF', // pH 10
    '#0046FF', // pH 11
    '#001EFF', // pH 12
    '#0000FF'  // pH 13 - Azul muy básico
  ];

  constructor() {
    this.generateMockData(7);
  }

  ngOnInit() {
    this.drawPhCircle();
    this.drawChart();
  }

  getPhStatus(): { color: string, label: string } {
    const phIndex = Math.floor(this.currentPh);
    const safeIndex = Math.max(0, Math.min(phIndex, this.PH_COLORS.length - 1));

    if (this.currentPh < 5) {
      return { color: this.PH_COLORS[safeIndex], label: 'ácido' };
    }
    if (this.currentPh > 8) {
      return { color: this.PH_COLORS[safeIndex], label: 'básico' };
    }
    return { color: this.PH_COLORS[7], label: 'óptimo' };
  }

  onTimeRangeChange(days: number) {
    this.timeRange = days;
    this.generateMockData(days);
    this.drawChart();
  }

  private drawPhCircle() {
    const svg = d3.select('#ph-circle');
    svg.selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const center = { x: width / 2, y: height / 2 };

    const g = svg.append('g')
      .attr('transform', `translate(${center.x},${center.y})`);

    // Ajustado para que comience en rojo (pH 0) desde la posición correcta
    const phScale = d3.scaleLinear()
      .domain([0, 14])
      .range([90, -270]); // Cambiado para que 0 comience en la posición correcta

    const arc = d3.arc()
      .innerRadius(radius - 30)
      .outerRadius(radius);

    // Dibujar los 14 segmentos
    for (let i = 0; i < 14; i++) {
      const startAngle = (phScale(i) * Math.PI) / 180;
      const endAngle = (phScale(i + 1) * Math.PI) / 180;

      g.append('path')
        .attr('d', arc({
          startAngle,
          endAngle
        } as any))
        .attr('fill', this.PH_COLORS[i])
        .attr('opacity', 0.9);
    }

    // Dibujar el puntero
    const pointer = g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -radius + 40)
      .attr('stroke', '#222867')
      .attr('stroke-width', 3);

    // Rotar el puntero al valor actual de pH
    const angle = phScale(this.currentPh);
    pointer.attr('transform', `rotate(${angle})`);
  }

  generateMockData(days: number) {
    this.phReadings = [];
    const now = new Date();

    const generatePh = () => {
      const ranges = [
        () => 3 + Math.random() * 3,     // Ácido: 3-6
        () => 6 + Math.random() * 3,     // Óptimo: 6-9
        () => 9 + Math.random() * 3      // Básico: 9-12
      ];
      const rangeIndex = Math.floor(Math.random() * ranges.length);
      return parseFloat(ranges[rangeIndex]().toFixed(1));
    };

    for (let i = 0; i < days; i++) {
      this.phReadings.push({
        id: i + 1,
        value: generatePh(),
        timestamp: new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000)
      });
    }

    if (this.phReadings.length > 0) {
      this.currentPh = this.phReadings[this.phReadings.length - 1].value;
    }
  }

  private drawChart() {
    const element = d3.select('#ph-chart');
    element.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = element
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(this.phReadings, d => d.timestamp) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 14])
      .range([height, 0]);

    const line = d3.line<PhReading>()
      .x(d => x(d.timestamp))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(this.phReadings)
      .attr('fill', 'none')
      .attr('stroke', '#222867')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.selectAll('.point')
      .data(this.phReadings)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.value))
      .attr('r', 4)
      .attr('fill', '#222867');

    const tickCount = this.timeRange <= 7 ? this.phReadings.length :
      this.timeRange <= 30 ? 7 : 12;

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(tickCount)
        .tickFormat(d => d3.timeFormat('%d/%m')(d as Date)));

    svg.append('g')
      .call(d3.axisLeft(y));
  }
}