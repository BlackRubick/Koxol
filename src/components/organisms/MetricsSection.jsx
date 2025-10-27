import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './MetricsSection.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MetricsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    searches: 0,
    speed: 0,
    ranking: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animación de contadores
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        searches: Math.floor(3000 * progress),
        speed: Math.floor(3 * progress * 10) / 10,
        ranking: Math.floor(100 * progress)
      });
      
      if (step >= steps) clearInterval(timer);
    }, increment);
    
    return () => clearInterval(timer);
  }, []);

  const data = {
    labels: ['Clientes Recurrentes', 'Distribuidores Activos', 'Tasa de Conversión Online', 'Reducción de Químicos Usados'],
    datasets: [
      {
        label: 'Impacto',
        data: [68, 25, 4.2, 1.2],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(129, 199, 132, 0.8)',
          'rgba(56, 142, 60, 0.8)',
          'rgba(46, 70, 0, 0.8)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(129, 199, 132, 1)',
          'rgba(56, 142, 60, 1)',
          'rgba(46, 70, 0, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(129, 199, 132, 1)',
          'rgba(56, 142, 60, 1)',
          'rgba(46, 70, 0, 1)'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Cambiar a false para permitir que la gráfica ocupe más espacio
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(46, 70, 0, 0.95)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4CAF50',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#81C784',
          font: {
            size: 12,
            weight: 'bold'
          },
          callback: function(value) {
            return value;
          }
        },
        grid: {
          color: 'rgba(129, 199, 132, 0.1)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: '#4CAF50',
          font: {
            size: 11,
            weight: '600'
          }
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  const metrics = [
    {
      icon: '👥',
      title: 'Clientes Recurrentes',
      value: '68%',
      description: 'Personas que vuelven a comprar K’oxol',
      color: '#4CAF50'
    },
    {
      icon: '🏪',
      title: 'Distribuidores Activos',
      value: '25',
      description: 'Aliados comerciales en tiendas físicas',
      color: '#81C784'
    },
    {
      icon: '📈',
      title: 'Tasa de Conversión Online',
      value: '4.2%',
      description: 'Porcentaje de visitantes que compran',
      color: '#388E3C'
    },
    {
      icon: '🌱',
      title: 'Reducción de Químicos Usados',
      value: '1.2 toneladas',
      description: 'Estimación del impacto ambiental positivo',
      color: '#2E4600'
    }
  ];

  return (
    <div className="metrics-container">
      <div className="metrics-header">
        <h2 className="metrics-title">Lo que hemos logrado</h2>
        <div className="metrics-subtitle">Impacto positivo y resultados tangibles</div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="icon-circle">
              <span className="icon">{metric.icon}</span>
            </div>
            <div className="metric-value" style={{ color: metric.color }}>
              {metric.value}
            </div>
            <div className="metric-title">{metric.title}</div>
            <div className="metric-description">{metric.description}</div>
          </div>
        ))}
      </div>

      <div className="chart-wrapper">
        <h3 className="chart-title">Análisis de Impacto</h3>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default MetricsSection;