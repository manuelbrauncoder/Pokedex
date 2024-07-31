import { Component, inject, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {
  apiService = inject(ApiService);
  chart: any = [];

  CHART_BG_COLOR = ['#ff5959', '#f5ac78', '#fae078', '#9db7f5', '#a7db8d', '#fa92b2'];

  ngOnInit(): void {
    this.initChart();
  }

 

  initChart(){
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.apiService.chartLabels,
        datasets: [
          {
            label: '# of Votes',
            data: this.apiService.chartData,
            borderWidth: 1,
            backgroundColor: this.CHART_BG_COLOR,
            barThickness: 15,
            borderRadius: 7.5
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: 'Nunito',
                weight: 700,
              }
            }
          },
        },
        indexAxis: 'y',
        plugins: {
          tooltip: {
            enabled: false
          },
          legend: {
            display: false
          }
        },
        layout: {
          padding: 16
        },
        responsive: true,
        maintainAspectRatio: false
      },
    });
  }
}
