import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
interface WeightData {
  date: Date;
  value: number;
}

interface AccumulatedGrowth {
  day: string;
  value: number;
}



@Component({
  selector: 'app-weight-dashboard',
  templateUrl: './weight-dashboard.component.html',
  styleUrls: ['./weight-dashboard.component.css']
})
export class WeightDashboardComponent implements OnInit {
  timeRange: number = 7;
  growthTimeRange: number = 7; // Nuevo timeRange específico para la gráfica de barras
  weightData: WeightData[] = [];
  accumulatedGrowth: AccumulatedGrowth[] = [];
  metrics = {
    totalWeight: 1000,
    density: 0,
    populationDensity: 0
  };

  constructor() {}

  ngOnInit() {
    this.generateData();
    this.drawCharts();
  }

  onTimeRangeChange(days: number) {
    this.timeRange = days;
    this.generateData();
    this.drawCharts();
  }

  onGrowthTimeRangeChange(days: number) {
    this.growthTimeRange = days;
    this.generateGrowthData();
    this.drawBarChart();
  }

  private generateData() {
    // Generate weight data
    const now = new Date();
    this.weightData = Array.from({length: this.timeRange}, (_, i) => ({
      date: new Date(now.getTime() - (this.timeRange - 1 - i) * 24 * 60 * 60 * 1000),
      value: Math.random() * 3 + 2 // Random weight between 2-5kg
    }));

    this.generateGrowthData();

    // Update metrics
    this.metrics = {
      totalWeight: 1000,
      density: Math.random() * 5 + 5,
      populationDensity: Math.random() * 10 + 10
    };
  }

  private generateGrowthData() {
    const now = new Date();
    let data: AccumulatedGrowth[] = [];

    if (this.growthTimeRange <= 7) {
      // Para 7 días, mostrar días de la semana
      data = Array.from({length: 7}, (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        return {
          day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
          value: Math.random() * 50 + 50
        };
      });
    } else if (this.growthTimeRange <= 30) {
      // Para un mes, mostrar semanas
      data = Array.from({length: 4}, (_, i) => {
        return {
          day: `Semana ${i + 1}`,
          value: Math.random() * 150 + 100
        };
      });
    } else {
      // Para 3 meses, mostrar meses
      data = Array.from({length: 3}, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1);
        return {
          day: date.toLocaleDateString('es-ES', { month: 'short' }),
          value: Math.random() * 300 + 200
        };
      });
    }

    this.accumulatedGrowth = data;
  }

  private drawCharts() {
    this.drawAreaChart();
    this.drawBarChart();
  }

  private drawAreaChart() {
    // Clear previous chart
    d3.select('#weightChart').selectAll('*').remove();

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    const svg = d3.select('#weightChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleTime()
      .domain(d3.extent(this.weightData, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.weightData, d => d.value) as number])
      .range([height, 0]);

    // Area generator
    const area = d3.area<WeightData>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add area
    svg.append('path')
      .datum(this.weightData)
      .attr('class', 'area')
      .attr('d', area)
      .attr('fill', '#222867')
      .attr('fill-opacity', 2);

    // Add line
    const line = d3.line<WeightData>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(this.weightData)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#222867')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(this.timeRange <= 7 ? this.timeRange : 7)
        .tickFormat(d => d3.timeFormat('%d/%m')(d as Date)));

    svg.append('g')
      .call(d3.axisLeft(y));
  }

  private drawBarChart() {
    // Clear previous chart
    d3.select('#growthChart').selectAll('*').remove();

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 270 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select('#growthChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(this.accumulatedGrowth.map(d => d.day))
      .padding(this.growthTimeRange <= 7 ? 0.1 : 0.2); // Ajustar el padding según el rango

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.accumulatedGrowth, d => d.value) as number])
      .range([height, 0]);

    // Add bars
    svg.selectAll('rect')
      .data(this.accumulatedGrowth)
      .enter()
      .append('rect')
      .attr('x', d => x(d.day) as number)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#222867');

    // Add axes with smaller font size and rotated labels if needed
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('font-size', '10px')
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', this.growthTimeRange <= 7 ? 'rotate(0)' : 'rotate(-45)');

    svg.append('g')
      .call(d3.axisLeft(y))
      .style('font-size', '10px');
  }
}