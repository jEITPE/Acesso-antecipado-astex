import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FormData {
  name: string;
  phone: string;
  email: string;
  company: string;
  niches: string[];
  other_niche?: string;
  recommend?: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    niches: [],
    other_niche: '',
    recommend: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = () => {
    return formData.name && formData.phone && formData.email && formData.company && formData.niches.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const response = await axios.post('http://localhost:8000/api/whitelist', formData);
        if (response.data.status === 'success') {
          setShowSuccess(true);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Formulário de Cadastro</h1>
          <Link 
            to="/admin" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Admin
          </Link>
        </div>
        {/* Adicione seu formulário aqui */}
      </div>
    </div>
  );
};

export default App; 