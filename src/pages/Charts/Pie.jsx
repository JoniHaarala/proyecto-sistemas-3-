import React from 'react';

import { pieChartData } from '../../data/configData';
import { ChartsHeader, PieChart } from '../../components';

const Pie = () => (
  <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
    <ChartsHeader category="Reportes" title="Propiedades por tipo de operacion" />
    <div className="w-full">
      <PieChart id="chart-pie" data={pieChartData} legendVisiblity height="full" />
    </div>
  </div>
);

export default Pie;