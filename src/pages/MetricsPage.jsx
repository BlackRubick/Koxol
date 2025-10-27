import React from 'react';
import './MetricsPage.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MetricsPage = () => {
  const data = {
    labels: ['SEO', 'Búsquedas ecológicas', 'Velocidad de carga', 'Seguridad'],
    datasets: [
      {
        label: 'Impacto',
        data: [90, 80, 95, 100],
        backgroundColor: ['#4CAF50', '#81C784', '#388E3C', '#2E4600'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Métricas de K’oxol',
      },
    },
  };

  return (
    <div className="metrics-container">
      <h1>Métricas</h1>
      <p>K’oxol aparece en los primeros resultados de búsqueda para ‘repelente natural sin DEET’.</p>
      <p>Más de 3,000 personas nos encuentran cada mes por búsquedas ecológicas.</p>
      <p>Nuestro sitio cumple con las mejores prácticas SEO y carga en menos de 3 segundos.</p>
      <p>Protegemos tu navegación con certificado SSL y diseño responsivo.</p>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MetricsPage;