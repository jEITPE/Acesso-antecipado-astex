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

  const isFormValid = () => {
    return formData.name && formData.phone && formData.email && formData.company && formData.niches.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        await axios.post('http://localhost:8000/api/whitelist', formData);
        // Success handling can be added here if needed
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Admin
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* Form content */}
        </form>
      </div>
    </div>
  );
};

export default App;