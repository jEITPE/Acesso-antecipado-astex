import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Entry {
  name: string;
  email: string;
  phone: string;
  company: string;
  niches: string[];
  recommend: string | null;
  created_at: string;
}

interface Stats {
  total_entries: number;
  niches_distribution: Record<string, number>;
  recommendations: Record<string, number>;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/admin/stats');
      const data = await response.json();
      setStats(data);

      const entriesResponse = await fetch('http://localhost:8000/api/admin/entries');
      const entriesData = await entriesResponse.json();
      setEntries(entriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Nome,Email,Telefone,Empresa,Nichos,Recomendação,Data\n"
      + entries.map(entry => {
        return `${entry.name},${entry.email},${entry.phone},${entry.company},"${entry.niches.join(';')}",${entry.recommend},${entry.created_at}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_astex.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Distribuição por Nicho',
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold' as 'bold'
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
            weight: 'bold' as 'bold'
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
            weight: 'bold' as 'bold'
          }
        }
      }
    }
  };

  const barData = {
    labels: stats?.niches_distribution ? Object.keys(stats.niches_distribution) : [],
    datasets: [
      {
        label: 'Número de Leads',
        data: stats?.niches_distribution ? Object.values(stats.niches_distribution) : [],
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              <Download size={20} />
              Exportar CSV
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <Users className="text-blue-500" size={32} />
              <div>
                <h3 className="text-gray-400 text-sm">Total de Leads</h3>
                <p className="text-2xl font-bold">{stats?.total_entries || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <Bar options={barOptions} data={barData} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Leads ({entries.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">NOME</th>
                  <th className="px-6 py-3 text-left">EMAIL</th>
                  <th className="px-6 py-3 text-left">TELEFONE</th>
                  <th className="px-6 py-3 text-left">EMPRESA</th>
                  <th className="px-6 py-3 text-left">NICHOS</th>
                  <th className="px-6 py-3 text-left">DATA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {entries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4">{entry.name}</td>
                    <td className="px-6 py-4">{entry.email}</td>
                    <td className="px-6 py-4">{entry.phone}</td>
                    <td className="px-6 py-4">{entry.company}</td>
                    <td className="px-6 py-4">{entry.niches.join(', ')}</td>
                    <td className="px-6 py-4">
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

export default AdminDashboard; 