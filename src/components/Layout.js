import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import calcularEspacoOtimizado from '../calcularEspacoOtimizado';
import '../styles.css';

const Layout = () => {
  const canvasRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = location.state || { items: [] };

  useEffect(() => {
    const desenharCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = 10; // Ajustar a escala para melhor visualização
      const larguraFixa = 57 * scale;
      const margem = 1 * scale;
      const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#33FFF5'];
      let currentHeight = 0;

      items.forEach((item, index) => {
        const largura = parseFloat(item.largura) * scale;
        const altura = parseFloat(item.altura) * scale;
        const quantidade = parseInt(item.quantidade, 10);

        if (!isNaN(largura) && !isNaN(altura) && !isNaN(quantidade)) {
          const color = colors[index % colors.length];
          const otimizado = calcularEspacoOtimizado(largura, altura, quantidade, larguraFixa, margem);
          let x = 0;
          let y = currentHeight;

          for (let i = 0; i < quantidade; i++) {
            ctx.fillStyle = color;
            if (otimizado.rotacionado) {
              ctx.fillRect(x, y, altura, largura);
              x += altura + margem;
              if (x + altura > larguraFixa) {
                x = 0;
                y += largura + margem;
              }
            } else {
              ctx.fillRect(x, y, largura, altura);
              x += largura + margem;
              if (x + largura > larguraFixa) {
                x = 0;
                y += altura + margem;
              }
            }
          }
          currentHeight = y + (otimizado.rotacionado ? largura : altura) + margem;
        }
      });

      canvas.height = currentHeight; // Ajustar a altura do canvas dinamicamente
      ctx.strokeStyle = '#000';
      ctx.strokeRect(0, 0, larguraFixa, currentHeight); // Desenhar o contorno da folha
    };

    desenharCanvas();
  }, [items]);

  return (
    <div className="layout-container">
      <h1>Layout da Simulação</h1>
      <button className="btn" onClick={() => navigate('/')}>
        Voltar
      </button>
      <div className="manutencao-container">
        <img src="/pato.png" alt="Manutenção" className="manutencao-imagem"/>
        <p>Página em Manutenção</p>
      </div>
      <canvas ref={canvasRef} width={570} height={1000}></canvas>
    </div>
  );
};

export default Layout;
