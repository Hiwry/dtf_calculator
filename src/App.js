import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './styles.css';

// Função para calcular o espaço otimizado manualmente
const calcularEspacoOtimizado = (larguraItem, alturaItem, quantidade, larguraFixa, margem) => {
  const items = [];

  for (let i = 0; i < quantidade; i++) {
    items.push({ width: larguraItem + margem, height: alturaItem + margem });
  }

  items.sort((a, b) => b.height - a.height);

  const bins = [];
  let currentBin = { width: larguraFixa, height: 0, items: [] };

  items.forEach(item => {
    if (item.width <= larguraFixa) {
      if (currentBin.width - item.width >= 0) {
        currentBin.items.push(item);
        currentBin.width -= item.width;
        currentBin.height = Math.max(currentBin.height, item.height);
      } else {
        bins.push(currentBin);
        currentBin = { width: larguraFixa - item.width, height: item.height, items: [item] };
      }
    }
  });

  bins.push(currentBin);

  let alturaNecessaria = 0;
  bins.forEach(bin => {
    alturaNecessaria += bin.height;
  });

  return {
    alturaNecessaria,
    bins
  };
};

const App = () => {
  const [items, setItems] = useState([]);
  const [resultado, setResultado] = useState(null);
  const canvasRef = useRef(null);

  const adicionarSecao = () => {
    setItems([...items, { largura: '', altura: '', quantidade: 1 }]);
  };

  const adicionarTamanho = (largura, altura) => {
    setItems([...items, { largura, altura, quantidade: 1 }]);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calcularAltura = () => {
    let alturaTotal = 0;
    const larguraFixa = 57;
    let valorTotal = 0;
    let resultadoIndividual = '';

    items.forEach((item, index) => {
      const largura = parseFloat(item.largura);
      const altura = parseFloat(item.altura);
      const quantidade = parseInt(item.quantidade, 10);

      if (!isNaN(largura) && !isNaN(altura) && !isNaN(quantidade)) {
        const otimizado = calcularEspacoOtimizado(largura, altura, quantidade, larguraFixa, 1);
        const alturaNecessaria = otimizado.alturaNecessaria;
        const metros = alturaNecessaria / 100;
        const valorTotalSeccao = calcularValorPorItem(metros);
        const valorPorItem = valorTotalSeccao / quantidade;

        alturaTotal += alturaNecessaria;

        resultadoIndividual += `
          <div>
            <h2>Seção ${index + 1}</h2>
            <p>Altura Necessária: ${alturaNecessaria.toFixed(2)} cm</p>
            <p>Valor por Item: R$ ${valorPorItem.toFixed(2)}</p>
            <p>Valor Total da Seção: R$ ${valorTotalSeccao.toFixed(2)}</p>
          </div>
        `;

        valorTotal += valorTotalSeccao;
      }
    });

    const metrosTotal = alturaTotal / 100;
    const valorTotalFinal = calcularValorPorItem(metrosTotal);

    setResultado(`
      ${resultadoIndividual}
      <h2>Resultado Final</h2>
      <p>Altura Total Necessária: ${alturaTotal.toFixed(2)} cm (${metrosTotal.toFixed(2)} metros)</p>
      <p>Valor Total: R$ ${valorTotalFinal.toFixed(2)}</p>
    `);

    desenharCanvas(items);
  };

  const calcularValorPorItem = (metros) => {
    const valoresSalvos = JSON.parse(localStorage.getItem('valores')) || {};

    const valoresTira = valoresSalvos.tira || {
      15: 50,
      44: 60,
      59: 65,
      74: 75,
      89: 80,
      99: 95
    };
    const valoresMetro = valoresSalvos.metro || {
      '1-2': 90,
      '2-5': 85,
      '5-10': 80,
      acima: 75
    };

    let valor = 0;

    for (const [limite, valorTira] of Object.entries(valoresTira)) {
      if (metros * 100 <= limite) {
        valor = valorTira;
        break;
      }
    }

    if (metros >= 1 && metros < 2) valor = metros * valoresMetro['1-2'];
    else if (metros >= 2 && metros < 5) valor = metros * valoresMetro['2-5'];
    else if (metros >= 5 && metros < 10) valor = metros * valoresMetro['5-10'];
    else if (metros >= 10) valor = metros * valoresMetro.acima;

    return parseFloat(valor);
  };

  const desenharCanvas = (items) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 10;
    const larguraFixa = 57 * scale;
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#33FFF5'];

    const allItems = [];
    items.forEach((item, index) => {
      const largura = parseFloat(item.largura) * scale;
      const altura = parseFloat(item.altura) * scale;
      const quantidade = parseInt(item.quantidade, 10);

      for (let i = 0; i < quantidade; i++) {
        allItems.push({ width: largura, height: altura, index });
      }
    });

    const result = calcularEspacoOtimizado(
      parseFloat(items[0].largura) * scale,
      parseFloat(items[0].altura) * scale,
      parseInt(items[0].quantidade, 10),
      larguraFixa,
      1 * scale
    );

    result.bins.forEach((bin, binIndex) => {
      bin.items.forEach((item, itemIndex) => {
        const color = colors[(binIndex + itemIndex) % colors.length];
        ctx.fillStyle = color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
      });
    });

    const canvasHeight = result.bins.reduce((max, bin) => Math.max(max, bin.height), 0);
    canvas.height = canvasHeight;
  };

  const exportarPDF = () => {
    const input = document.getElementById('resultado');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('resultado.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF', error);
      });
  };

  return (
    <div className="container">
      <header>
        <h1>Calculadora de DTF</h1>
      </header>
      <div className="mini-guide">
        <h2>Guia Rápido</h2>
        <p>Use os botões abaixo para adicionar seções pré-definidas ou personalize suas próprias.</p>
      </div>
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
      <div className="itens-container">
        {items.map((item, index) => (
          <div className="section" key={index}>
            <button className="remove-button" onClick={() => handleRemove(index)}>
              <i className="fas fa-trash-alt"></i>
            </button>
            <h2>Quantidade de Itens {index + 1}:</h2>
            <label>Quantidade:</label>
            <input type="number" value={item.quantidade} min="1" onChange={(e) => handleChange(index, 'quantidade', e.target.value)} />
            <label>Largura do item (cm):</label>
            <input type="number" value={item.largura} onChange={(e) => handleChange(index, 'largura', e.target.value)} />
            <label>Altura do item (cm):</label>
            <input type="number" value={item.altura} onChange={(e) => handleChange(index, 'altura', e.target.value)} />
          </div>
        ))}
      </div>
      <div className="actions">
        <button className="btn" onClick={adicionarSecao}>
          <i className="fas fa-plus-circle"></i> Adicionar Item
        </button>
        <button className="btn" onClick={calcularAltura}>
          <i className="fas fa-calculator"></i> Calcular Altura
        </button>
        <button className="btn" onClick={exportarPDF}>
          <i className="fas fa-file-pdf"></i> Exportar PDF
        </button>
      </div>
      <div id="resultado" dangerouslySetInnerHTML={{ __html: resultado }}></div>
      <canvas ref={canvasRef} width={570} height={1000}></canvas>
    </div>
  );
};

export default App;
