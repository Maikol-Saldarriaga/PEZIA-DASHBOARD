import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface FishData {
  alive: number;
  dead: number;
}

@Component({
  selector: 'app-mortalidad',
  templateUrl: './mortalidad.component.html',
  styleUrls: ['./mortalidad.component.css']
})
export class MortalidadComponent implements OnInit{
  fishData: FishData = {
    alive: 1800,
    dead: 200
  };

  ngOnInit() {
    this.createPieChart();
    this.createBarChart();
  }

  private createPieChart(): void {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Limpiar el contenedor existente
    d3.select('#donut-chart').selectAll('*').remove();

    const svg = d3.select('#donut-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const total = this.fishData.alive + this.fishData.dead;
    const pieData = [
      { label: 'Vivos', value: this.fishData.alive, percentage: (this.fishData.alive / total) * 100 },
      { label: 'Muertos', value: this.fishData.dead, percentage: (this.fishData.dead / total) * 100 }
    ];

    const color = d3.scaleOrdinal<string>()
      .domain(['Vivos', 'Muertos'])
      .range(['#222867', '#f43f5e']);

    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0) // Cambio a 0 para hacer un gráfico circular en lugar de anillo
      .outerRadius(radius);

    // Agregar los segmentos
    const paths = svg.selectAll('path')
      .data(pie(pieData))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => color(d.data.label));

    // Agregar etiquetas de porcentaje
    svg.selectAll('text.percentage')
      .data(pie(pieData))
      .enter()
      .append('text')
      .attr('class', 'percentage')
      .attr('transform', d => `translate(${arc.centroid(d as any)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '14px')
      .text(d => `${Math.round(d.data.percentage)}%`);
  }

  private createBarChart(): void {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Limpiar el contenedor existente
    d3.select('#bar-chart').selectAll('*').remove();

    const svg = d3.select('#bar-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const chartData = [
      { label: 'Peces vivos', value: this.fishData.alive },
      { label: 'Peces muertos', value: this.fishData.dead }
    ];

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.3)
      .domain(chartData.map(d => d.label));

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, Math.max(this.fishData.alive, this.fishData.dead)]);

    // Agregar eje X
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle');

    // Agregar eje Y
    svg.append('g')
      .call(d3.axisLeft(y));

    // Agregar barras
    svg.selectAll('rect')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.label) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => d.label === 'Peces vivos' ? '#222867' : '#f43f5e');

    // Agregar etiquetas de valores
    svg.selectAll('.label')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.value);
  }
}