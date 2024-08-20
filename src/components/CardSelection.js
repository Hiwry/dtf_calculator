import React from 'react';

const CardSelection = ({ adicionarTamanho }) => (
  <div className="card-selection">
    <button className="card-btn" onClick={() => adicionarTamanho(10, 10)}>
      <i className="fas fa-shield-alt"></i> Escudo (10x10 cm)
    </button>
    <button className="card-btn" onClick={() => adicionarTamanho(21, 29.7)}>
      <i className="fas fa-file-alt"></i> A4 (29.7x21 cm)
    </button>
    <button className="card-btn" onClick={() => adicionarTamanho(29.7, 42)}>
      <i className="fas fa-file-alt"></i> A3 (42x29.7 cm)
    </button>
  </div>
);

export default CardSelection;
