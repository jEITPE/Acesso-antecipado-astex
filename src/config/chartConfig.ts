import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#fff',
        font: {
          size: 12,
          weight: 'bold' as const
        }
      }
    },
    title: {
      display: true,
      text: 'Distribuição por Nicho',
      color: '#fff',
      font: {
        size: 16,
        weight: 'bold' as const
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#fff',
        font: {
          weight: 'bold' as const
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#fff',
        font: {
          weight: 'bold' as const
        }
      }
    }
  }
};
