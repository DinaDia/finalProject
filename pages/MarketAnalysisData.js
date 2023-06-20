import MarketAnalysis from './MarketAnalysis';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      data: [65, 59, 80, 81, 56, 55],
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function Home() {
  return (
    <div>
      <MarketAnalysis data={data} options={options} />
    </div>
  );
}
