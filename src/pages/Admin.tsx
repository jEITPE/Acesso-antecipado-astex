/// <reference types="vite/client" />
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
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const Admin = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        console.log('Buscando dados...');
        setLoading(true);
        const response = await fetch(`${API_URL}/admin/entries`);
        console.log('Response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        setEntries(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error instanceof Error ? error.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Distribuição por Nicho',
        color: '#fff',
        font: {
          size: 16
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
          color: '#fff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  // Preparar dados para o gráfico
  const nichesCount = entries.reduce((acc, entry) => {
    entry.niches.forEach(niche => {
      acc[niche] = (acc[niche] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(nichesCount),
    datasets: [
      {
        label: 'Número de Leads',
        data: Object.values(nichesCount),
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div>Erro: {error}</div>
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
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8,"
                  + "Nome,Email,Telefone,Empresa,Nichos,Data\n"
                  + entries.map(entry => {
                    return `${entry.name},${entry.email},${entry.phone},${entry.company},"${entry.niches.join(';')}",${entry.created_at}`;
                  }).join("\n");
                const link = document.createElement("a");
                link.setAttribute("href", encodeURI(csvContent));
                link.setAttribute("download", "leads_astex.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <Bar data={data} options={options} />
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

export default Admin;