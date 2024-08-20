import React from 'react';

const Actions = ({ adicionarSecao, handleCalcularAltura }) => (
  <div className="actions">
    <button className="btn" onClick={adicionarSecao}>
      <i className="fas fa-plus-circle"></i> Adicionar Item
    </button>
    <button className="btn" onClick={handleCalcularAltura}>
      <i className="fas fa-calculator"></i> Calcular Altura
    </button>
  </div>
);

export default Actions;
