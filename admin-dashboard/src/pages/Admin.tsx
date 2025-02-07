import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, TrendingUp, ThumbsUp, Building, Download, Search, Sun, Moon } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Stats {
  total_entries: number;
  niches_distribution: Record<string, number>;
  recommendations: Record<string, number>;
}

interface Entry {
  name: string;
  email: string;
  phone: string;
  company: string;
  niches: string[];
  other_niche?: string;
  recommend?: string;
  created_at: string;
}

const Admin: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, entriesResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/stats'),
          axios.get('http://localhost:8000/api/whitelist')
        ]);
        setStats(statsResponse.data);
        setEntries(entriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNiche = selectedNiche === 'all' || entry.niches.includes(selectedNiche);
    
    return matchesSearch && matchesNiche;
  });

  // Configurações melhoradas dos gráficos
  const pieChartData = {
    labels: stats?.niches_distribution ? Object.keys(stats.niches_distribution) : [],
    datasets: [{
      data: stats?.niches_distribution ? Object.values(stats.niches_distribution) : [],
      backgroundColor: [
        '#3B82F6', // Azul
        '#10B981', // Verde
        '#F59E0B', // Laranja
        '#8B5CF6', // Roxo
        '#EC4899', // Rosa
        '#6B7280'  // Cinza
      ],
      borderWidth: 0
    }]
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#1F2937', // Texto preto
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    }
  };

  const barChartData = {
    labels: ['Sim', 'Não'],
    datasets: [{
      label: 'Recomendações',
      data: stats?.recommendations ? [
        stats.recommendations['Sim'] || 0,
        stats.recommendations['Não'] || 0
      ] : [],
      backgroundColor: ['#10B981', '#EF4444'],
      borderRadius: 6
    }]
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#1F2937',
          font: {
            weight: '500'
          }
        }
      },
      x: {
        ticks: {
          color: '#1F2937',
          font: {
            weight: '500'
          }
        }
      }
    }
  };

  // Função para formatar nome (remover caracteres especiais)
  const formatName = (name: string) => {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Carregando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={() => {/* Lógica de exportação */}}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Exportar CSV
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900/50 rounded-lg">
                <Users className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total de Leads</p>
                <p className="text-2xl font-bold text-white">{stats?.total_entries || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Distribuição por Nicho</h3>
            <div className="h-64">
              <Pie data={pieChartData} options={{
                ...pieOptions,
                plugins: {
                  ...pieOptions.plugins,
                  legend: {
                    ...pieOptions.plugins.legend,
                    labels: {
                      ...pieOptions.plugins.legend.labels,
                      color: '#fff'
                    }
                  }
                }
              }} />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Recomendações</h3>
            <div className="h-64">
              <Bar data={barChartData} options={{
                ...barOptions,
                scales: {
                  ...barOptions.scales,
                  y: {
                    ...barOptions.scales.y,
                    ticks: { ...barOptions.scales.y.ticks, color: '#fff' }
                  },
                  x: {
                    ...barOptions.scales.x,
                    ticks: { ...barOptions.scales.x.ticks, color: '#fff' }
                  }
                }
              }} />
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Leads ({filteredEntries.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nichos</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredEntries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm">{formatName(entry.name)}</td>
                    <td className="px-6 py-4 text-sm">{entry.email}</td>
                    <td className="px-6 py-4 text-sm">{entry.phone}</td>
                    <td className="px-6 py-4 text-sm">{entry.company}</td>
                    <td className="px-6 py-4">
                      {entry.niches.map(niche => (
                        <span key={niche} className="inline-block px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900/50 rounded-full mr-2">
                          {niche}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 