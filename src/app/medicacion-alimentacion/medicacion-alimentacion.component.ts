import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

interface WeightData {
  date: Date;
  value: number;
}

interface FoodRecord {
  product: string;
  date: Date;
  time: string;
  amount: number;
}

interface Treatment {
  name: string;
  dose: string;
  startDate: Date;
  endDate: Date;
  product: string;
  result: string;
}

interface PieChartData {
  category: string;
  value: number;
}
@Component({
  selector: 'app-medicacion-alimentacion',
  templateUrl: './medicacion-alimentacion.component.html',
  styleUrls: ['./medicacion-alimentacion.component.css']
})
export class MedicacionAlimentacionComponent implements OnInit {
  timeRange: number = 7;
  weightData: WeightData[] = [];
  foodRecords: FoodRecord[] = [];
  treatments: Treatment[] = [];
  metrics = {
    totalWeight: 1000,
    density: 0,
    populationDensity: 0
  };

  pieChartData: PieChartData[] = [
    { category: 'Prevención de Enfermedades', value: 30 },
    { category: 'Suplementación Nutricional', value: 20 },
    { category: 'Manejo del Estrés', value: 40 },
    { category: 'Control de Parásitos', value: 10 }
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.generateData();
    this.drawCharts();
  }

  onTimeRangeChange(days: number) {
    this.timeRange = days;
    this.generateData();
    this.drawCharts();
  }

  private generateData() {
    const now = new Date();
    const foodProducts = ['Mojarra 45', 'Mojarra 38', 'Mojarra 32'];
    const treatmentTypes = [
      'Prevención de Enfermedades',
      'Manejo del Estrés',
      'Suplementación Nutricional',
      'Control de Parásitos'
    ];
    const results = ['Exitoso', 'En proceso', 'Pendiente', 'Completado'];
    const treatmentProducts = ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'];

    // Generar datos de peso
    this.weightData = Array.from({ length: this.timeRange }, (_, i) => ({
      date: new Date(now.getTime() - (this.timeRange - 1 - i) * 24 * 60 * 60 * 1000),
      value: Math.random() * 3 + 2
    }));

    // Generar registros de comida (3-5 por día)
    this.foodRecords = [];
    for (let i = 0; i < this.timeRange; i++) {
      const date = new Date(now.getTime() - (this.timeRange - 1 - i) * 24 * 60 * 60 * 1000);
      const recordsPerDay = Math.floor(Math.random() * 3) + 3; // 3-5 registros

      for (let j = 0; j < recordsPerDay; j++) {
        const hours = Math.floor(Math.random() * 12) + 8; // Entre 8:00 y 20:00
        const minutes = Math.floor(Math.random() * 60);
        this.foodRecords.push({
          product: foodProducts[Math.floor(Math.random() * foodProducts.length)],
          date: new Date(date),
          time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`,
          amount: Math.floor(Math.random() * (2500 - 1000) + 1000)
        });
      }
    }
    this.foodRecords.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Generar tratamientos (15 registros para probar el scroll)
    this.treatments = Array.from({ length: 15 }, (_, i) => {
      const startDate = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000);

      return {
        name: treatmentTypes[Math.floor(Math.random() * treatmentTypes.length)],
        dose: `${Math.floor(Math.random() * 100) + 1}mg`,
        startDate: startDate,
        endDate: endDate,
        product: treatmentProducts[Math.floor(Math.random() * treatmentProducts.length)],
        result: results[Math.floor(Math.random() * results.length)]
      };
    });
    this.treatments.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    // Actualizar métricas
    this.metrics = {
      totalWeight: this.foodRecords.reduce((sum, record) => sum + record.amount, 0),
      density: Math.random() * 5 + 5,
      populationDensity: Math.random() * 10 + 10
    };
  }

  private drawCharts() {
    this.drawWeightChart();
    this.drawPieChart();
  }

  private drawWeightChart() {
    const element = this.elementRef.nativeElement.querySelector('#weightChart');
    d3.select(element).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 900 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    const svg = d3.select(element)
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
      .attr('fill-opacity', 0.2);

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

  private drawPieChart() {
    const element = this.elementRef.nativeElement.querySelector('#pieChart');
    d3.select(element).selectAll('*').remove();

    const width = element.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(this.pieChartData.map(d => d.category))
      .range(['#222867', '#4CAF50', '#2196F3', '#FFC107']);

    const pie = d3.pie<PieChartData>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius - 40);

    const arcs = svg.selectAll('arc')
      .data(pie(this.pieChartData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.category));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => `${d.data.value}%`);
  }
}