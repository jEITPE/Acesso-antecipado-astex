import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bot, Rocket, MessageSquare, Target, Star, Instagram, Linkedin } from 'lucide-react';
import axios from 'axios';

type FormData = {
  name: string;
  phone: string;
  email: string;
  company: string;
  niches: string[];
  otherNiche: string;
  recommend: string | null;
};

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  company: '',
  niches: [],
  otherNiche: '',
  recommend: null,
};

function App() {
  const [lightMode, setLightMode] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const niches = ['Delivery', 'Hotelaria', 'Imobiliária', 'Saúde e Estética', 'E-commerce', 'Outros'];
  const faqQuestions = [
    {
      question: 'Posso substituir totalmente minha equipe de vendas e atendimento por Agentes IA?',
      answer: 'Nossos Agentes IA são projetados para complementar e potencializar sua equipe, não substituí-la completamente. Eles automatizam tarefas repetitivas e fornecem suporte 24/7, permitindo que sua equipe foque em interações mais estratégicas.'
    },
    {
      question: 'É fácil treinar um Agente IA?',
      answer: 'Sim! Nossa plataforma foi desenvolvida para ser intuitiva e fácil de usar. Oferecemos suporte completo e documentação detalhada para ajudar no processo de treinamento.'
    },
    {
      question: 'Vocês podem me ajudar a treinar os Agentes IA e configurar outros recursos do Agente?',
      answer: 'Absolutamente! Nossa equipe de suporte está disponível para ajudar em todo o processo de configuração e treinamento, garantindo que você aproveite ao máximo nossa solução.'
    },
    {
      question: 'Preciso de conhecimentos técnicos ou de programação?',
      answer: 'Não é necessário conhecimento técnico ou de programação. Nossa interface é intuitiva e amigável, permitindo que qualquer pessoa possa configurar e gerenciar os Agentes IA.'
    },
    {
      question: 'Nossas vendas são complexas, o Agente IA conseguirá aprender?',
      answer: 'Sim! Nossa IA é treinada para lidar com cenários complexos de vendas. Ela aprende continuamente com as interações e pode ser personalizada para seu processo específico de vendas.'
    },
    {
      question: 'Posso atender clientes em inglês e outras línguas com IA?',
      answer: 'Sim! Nossos Agentes IA são multilíngues e podem atender clientes em diversos idiomas, incluindo inglês, espanhol, português e outros.'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY <= lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNicheChange = (niche: string) => {
    // Agora vamos tratar como radio button - apenas um nicho por vez
    if (niche === 'Outros') {
      if (formData.niches.includes('Outros')) {
        // Desmarca Outros
        setFormData(prev => ({
          ...prev,
          niches: [],
          otherNiche: ''
        }));
        setShowOtherInput(false);
      } else {
        // Marca apenas Outros
        setFormData(prev => ({
          ...prev,
          niches: ['Outros']
        }));
        setShowOtherInput(true);
      }
    } else {
      // Para outros nichos, substitui completamente o array
      setFormData(prev => ({
        ...prev,
        niches: [niche],
        otherNiche: '' // Limpa o outro nicho se existir
      }));
      setShowOtherInput(false);
    }
  };

  const handleRecommendChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      recommend: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.email && formData.company && formData.niches.length > 0) {
      setIsSubmitting(true);
      try {
        // Formata os dados conforme esperado pelo backend
        const submitData = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          niches: formData.niches,
          other_niche: formData.otherNiche.trim() || undefined,
          recommend: formData.recommend || undefined
        };

        const response = await axios.post('http://localhost:8000/api/whitelist', submitData);

        if (response.data.status === 'success') {
          setShowSuccess(true);
          setFormData(initialFormData);
        }
      } catch (error: any) {
        console.error('Erro ao enviar formulário:', error);
        // Mensagem de erro mais específica
        if (error.response) {
          alert(`Erro: ${error.response.data.detail || 'Erro ao enviar o formulário'}`);
        } else {
          alert('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`min-h-screen font-poppins transition-colors duration-300 ${lightMode ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'
      }`}>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${lightMode ? 'bg-white' : 'bg-gray-900'} shadow-lg`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/astex-logo.png"
                alt="Astex Logo"
                className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain filter brightness-200"
              />
              <span className="text-2xl font-bold">Astex</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="hover:text-blue-500 transition-colors">
                Recursos
              </button>
              <button onClick={() => scrollToSection('benefits')} className="hover:text-blue-500 transition-colors">
                Benefícios
              </button>
              <button onClick={() => scrollToSection('faq')} className="hover:text-blue-500 transition-colors">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-blue-500 transition-colors">
                Contato
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLightMode(!lightMode)}
                className={`p-2 rounded-full ${lightMode ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-yellow-400'
                  } shadow-lg transition-all hover:scale-110`}
              >
                {lightMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <a
                href="#form"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Começar Agora
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {!showSuccess ? (
          <>
            <section className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
              <div className="container mx-auto py-8 md:py-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="w-full max-w-md mx-auto order-2 md:order-1">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl">
                      <h2 className="text-2xl font-bold mb-6 text-center">Acesso Antecipado</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nome</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full p-3 rounded-lg border ${lightMode ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'
                              } focus:ring-2 focus:ring-blue-500 outline-none`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Telefone</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`w-full p-3 rounded-lg border ${lightMode ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'
                              } focus:ring-2 focus:ring-blue-500 outline-none`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">E-mail</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full p-3 rounded-lg border ${lightMode ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'
                              } focus:ring-2 focus:ring-blue-500 outline-none`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Nome da empresa</label>
                          <input
                            type="text"
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className={`w-full p-3 rounded-lg border ${lightMode ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'
                              } focus:ring-2 focus:ring-blue-500 outline-none`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-3">Nicho de atuação</label>
                          <div className="grid grid-cols-2 gap-3">
                            {niches.map((niche) => (
                              <label key={niche} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={formData.niches.includes(niche)}
                                  onChange={() => handleNicheChange(niche)}
                                  className="hidden"
                                />
                                <div
                                  onClick={() => handleNicheChange(niche)}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.niches.includes(niche)
                                    ? 'border-blue-500 bg-blue-500'
                                    : lightMode
                                      ? 'border-gray-300'
                                      : 'border-gray-400'
                                    }`}
                                >
                                  {formData.niches.includes(niche) && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className="text-sm">{niche}</span>
                              </label>
                            ))}
                          </div>

                          {showOtherInput && (
                            <input
                              type="text"
                              placeholder="Especifique seu nicho"
                              value={formData.otherNiche}
                              onChange={(e) => setFormData({ ...formData, otherNiche: e.target.value })}
                              className={`mt-3 w-full p-3 rounded-lg border ${lightMode ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'
                                } focus:ring-2 focus:ring-blue-500 outline-none`}
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-3">Recomendaria esse produto?</label>
                          <div className="flex space-x-4">
                            {['Sim', 'Não'].map((option) => (
                              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={formData.recommend === option}
                                  onChange={() => handleRecommendChange(option)}
                                  className="hidden"
                                />
                                <div
                                  onClick={() => handleRecommendChange(option)}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.recommend === option
                                    ? 'border-blue-500 bg-blue-500'
                                    : lightMode
                                      ? 'border-gray-300'
                                      : 'border-gray-400'
                                    }`}
                                >
                                  {formData.recommend === option && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.company || formData.niches.length === 0}
                          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 disabled:bg-gray-400 relative"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                              Enviando...
                            </div>
                          ) : (
                            'Solicitar Acesso Antecipado'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center md:text-left space-y-4 md:space-y-6 order-1 md:order-2 relative">
                    <img
                      src="/astex-logo.png"
                      alt="Astex Logo"
                      className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 opacity-20 w-1/2 aspect-square object-contain filter brightness-150"
                    />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300 relative z-10">
                      Atenda seus clientes com IA no Delivery
                    </h1>

                    <p className="text-xl text-gray-300 mb-8">
                      Revolucione o atendimento da sua empresa com soluções de IA da Astex
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <Bot className="text-blue-500" size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg">Atendimento 24/7</h3>
                          <p className="text-gray-400">Seus clientes recebem suporte instantâneo a qualquer momento</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <Rocket className="text-blue-500" size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg">Escalabilidade Imediata</h3>
                          <p className="text-gray-400">Atenda centenas de clientes simultaneamente sem perder qualidade</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <Target className="text-blue-500" size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg">Personalização Avançada</h3>
                          <p className="text-gray-400">IA que aprende e se adapta ao seu negócio e seus clientes</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center md:justify-start space-x-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Star className="text-yellow-500 mr-2" size={20} />
                        <span>Acesso antecipado gratuito</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <MessageSquare className="text-blue-500 mr-2" size={20} />
                        <span>Suporte prioritário</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="features" className="py-20 bg-gradient-to-b from-transparent to-blue-900/10">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Nós ajudamos a potencializar o seu negócio</h2>
                <p className="text-center max-w-3xl mx-auto mb-16 text-lg">
                  Nossa missão é impulsionar o crescimento ilimitado de negócios por meio da inteligência artificial,
                  oferecendo soluções de atendimento escaláveis, eficientes e sustentáveis.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className={`p-6 rounded-xl ${lightMode ? 'bg-white' : 'bg-gray-800'
                    } shadow-xl transform hover:scale-105 transition-all`}>
                    <MessageSquare className="text-blue-500 mb-4" size={32} />
                    <h3 className="text-xl font-semibold mb-2">Respostas instantâneas e personalizadas</h3>
                    <p className={lightMode ? 'text-gray-600' : 'text-gray-300'}>
                      Com a IA no atendimento, sua empresa oferece respostas imediatas e personalizadas,
                      compreendendo o contexto para soluções relevantes. Isso melhora a experiência do cliente,
                      fortalece a confiança e aumenta a retenção.
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl ${lightMode ? 'bg-white' : 'bg-gray-800'
                    } shadow-xl transform hover:scale-105 transition-all`}>
                    <Bot className="text-blue-500 mb-4" size={32} />
                    <h3 className="text-xl font-semibold mb-2">Interações Inteligentes e Fluídas</h3>
                    <p className={lightMode ? 'text-gray-600' : 'text-gray-300'}>
                      Nossa inteligência artificial qualifica leads, agenda reuniões, esclarece dúvidas e direciona
                      clientes para o checkout ou para o vendedor certo, oferecendo uma interação precisa e empática
                      a todo momento.
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl ${lightMode ? 'bg-white' : 'bg-gray-800'
                    } shadow-xl transform hover:scale-105 transition-all`}>
                    <Target className="text-blue-500 mb-4" size={32} />
                    <h3 className="text-xl font-semibold mb-2">Aumento na conversão de leads</h3>
                    <p className={lightMode ? 'text-gray-600' : 'text-gray-300'}>
                      Os Agentes IA qualificam leads em tempo real, direcionando-os ao vendedor certo ou ao processo
                      de compra. Com atendimento 24/7, garantem uma jornada personalizada, aumentando a conversão e
                      impulsionando as vendas continuamente.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="benefits" className="py-20">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-bold mb-6">Profissionalize seu Atendimento e Eleve sua Reputação</h2>
                    <p className={`text-lg mb-8 ${lightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                      Um atendimento profissional é essencial para construir confiança e reputação no mercado.
                      Nosso produto foi criado para otimizar a comunicação, oferecer respostas rápidas e melhorar
                      a experiência do cliente. Com ele, você transforma interações em oportunidades de fidelização
                      e crescimento.
                    </p>
                    <button
                      onClick={() => scrollToSection('form')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Comece agora!
                    </button>
                  </div>
                  <div className="relative">
                    <div className={`absolute -top-4 -right-4 w-full h-full rounded-xl ${lightMode ? 'bg-blue-100' : 'bg-blue-900/20'
                      }`}></div>
                    <img
                      src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                      alt="Customer Service"
                      className="rounded-xl relative z-10 w-full h-[400px] object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section id="faq" className={`py-20 ${lightMode ? 'bg-gray-100' : 'bg-gray-800/50'}`}>
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">FAQ - Astex Technologies</h2>
                <div className="max-w-3xl mx-auto space-y-6">
                  {faqQuestions.map((faq, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl ${lightMode ? 'bg-white' : 'bg-gray-800'
                        } shadow-lg transition-all hover:shadow-xl`}
                    >
                      <h3 className="text-lg font-semibold mb-3 text-blue-500">{faq.question}</h3>
                      <p className={lightMode ? 'text-gray-600' : 'text-gray-300'}>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="container mx-auto px-4 py-20">
            <div className={`max-w-2xl mx-auto text-center p-8 rounded-xl shadow-xl ${lightMode ? 'bg-white' : 'bg-gray-800'
              } animate-fade-in`}>
              <Rocket className="mx-auto text-blue-500 mb-4" size={48} />
              <h2 className="text-3xl font-bold mb-4">Solicitação Enviada com Sucesso!</h2>
              <p className={`mb-6 ${lightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                Enviamos um e-mail de confirmação para você. Nossa equipe entrará em contato em breve
                para dar continuidade ao processo.
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setFormData(initialFormData);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Voltar para o início
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className={`py-12 ${lightMode ? 'bg-gray-100' : 'bg-gray-800/50'}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/astex-logo.png"
                  alt="Astex Logo"
                  className="h-10 w-10 md:h-12 md:w-12 object-contain filter brightness-200"
                />
                <span className="text-xl font-bold">Astex</span>
              </div>
              <p className={`${lightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                Revolucionando o atendimento com IA inteligente e eficiente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                  >
                    Recursos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('benefits')}
                    className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                  >
                    Benefícios
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                  >
                    Termos de Serviço
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                  >
                    Política de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                  >
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                    }`}
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className={`hover:text-blue-500 transition-colors ${lightMode ? 'text-gray-600' : 'text-gray-300'
                    }`}
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className={lightMode ? 'text-gray-600' : 'text-gray-300'}>
              © 2024 Astex Technologies - Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
