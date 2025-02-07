import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, TrendingUp, ThumbsUp, Building, Download, Search } from 'lucide-react';
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

function Admin() {
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

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Empresa', 'Nichos', 'Data'];
    const csvData = filteredEntries.map(entry => [
      entry.name,
      entry.email,
      entry.phone,
      entry.company,
      entry.niches.join('; '),
      new Date(entry.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'leads_astexai.csv';
    link.click();
  };

  const pieChartData = {
    labels: stats?.niches_distribution ? Object.keys(stats.niches_distribution) : [],
    datasets: [{
      data: stats?.niches_distribution ? Object.values(stats.niches_distribution) : [],
      backgroundColor: [
        '#2563eb',
        '#3b82f6',
        '#60a5fa',
        '#93c5fd',
        '#bfdbfe',
      ],
    }],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Astex AI</h1>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Download size={20} />
            Exportar CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Total de Leads</h3>
              <Users className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{stats?.total_entries}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Nichos Únicos</h3>
              <Building className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold">
              {stats?.niches_distribution ? Object.keys(stats.niches_distribution).length : 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Recomendariam</h3>
              <ThumbsUp className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold">
              {stats?.recommendations?.['Sim'] || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500">Média por Nicho</h3>
              <TrendingUp className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold">
              {stats?.total_entries && stats.niches_distribution
                ? (stats.total_entries / Object.keys(stats.niches_distribution).length).toFixed(1)
                : 0}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Distribuição por Nicho</h2>
            <div className="h-64">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Recomendações</h2>
            <div className="h-64">
              <Bar
                data={{
                  labels: ['Recomendariam', 'Não Recomendariam'],
                  datasets: [{
                    data: [
                      stats?.recommendations?.['Sim'] || 0,
                      stats?.recommendations?.['Não'] || 0
                    ],
                    backgroundColor: ['#2563eb', '#ef4444'],
                  }],
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou empresa..."
                  className="pl-10 w-full p-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Nicho
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
              >
                <option value="all">Todos os Nichos</option>
                {stats?.niches_distribution && 
                  Object.keys(stats.niches_distribution).map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Leads ({filteredEntries.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nichos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.niches.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
}

export default Admin; 