import React from 'react';

const Section = ({ id, largura, altura, quantidade, removerSecao, atualizarSecao }) => (
  <div className="section" id={`section-${id}`}>
    <button className="remove-button" onClick={() => removerSecao(id)}>
      <i className="fas fa-trash-alt"></i>
    </button>
    <h2>Quantidade de Itens {id}:</h2>
    <label htmlFor={`quantidade-${id}`}>Quantidade:</label>
    <input type="number" id={`quantidade-${id}`} value={quantidade} onChange={e => atualizarSecao(id, 'quantidade', e.target.value)} min="1" required />
    <div>
      <label htmlFor={`largura-${id}`}>Largura do item (cm):</label>
      <input type="number" id={`largura-${id}`} value={largura} onChange={e => atualizarSecao(id, 'largura', e.target.value)} step="0.1" min="0" />
      <label htmlFor={`altura-${id}`}>Altura do item (cm):</label>
      <input type="number" id={`altura-${id}`} value={altura} onChange={e => atualizarSecao(id, 'altura', e.target.value)} step="0.1" min="0" />
    </div>
  </div>
);

export default Section;
