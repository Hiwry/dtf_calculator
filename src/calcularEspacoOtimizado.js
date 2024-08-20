const calcularEspacoOtimizado = (larguraItem, alturaItem, quantidade, larguraFixa, margem) => {
  const itens = [];
  let alturaTotal = 0;
  let larguraRestante = larguraFixa;
  let alturaAtualLinha = 0;
  let itensRotacionados = 0;
  let linhas = [];

  for (let i = 0; i < quantidade; i++) {
    let colocado = false;

    // Verificar se cabe na orientação original
    if (larguraItem <= larguraRestante) {
      itens.push({
        x: larguraFixa - larguraRestante,
        y: alturaTotal,
        largura: larguraItem,
        altura: alturaItem,
        rotacionado: false,
      });
      larguraRestante -= larguraItem + margem;
      alturaAtualLinha = Math.max(alturaAtualLinha, alturaItem);
      colocado = true;
    }

    // Verificar se cabe rotacionado
    if (!colocado && alturaItem <= larguraRestante) {
      itens.push({
        x: larguraFixa - larguraRestante,
        y: alturaTotal,
        largura: alturaItem,
        altura: larguraItem,
        rotacionado: true,
      });
      larguraRestante -= alturaItem + margem;
      alturaAtualLinha = Math.max(alturaAtualLinha, larguraItem);
      itensRotacionados++;
      colocado = true;
    }

    // Se o item não couber na linha atual, inicia uma nova linha
    if (!colocado) {
      linhas.push({ altura: alturaAtualLinha, itens: [...itens] });
      alturaTotal += alturaAtualLinha + margem;
      larguraRestante = larguraFixa;
      alturaAtualLinha = 0;
      i--; // Retroceder para tentar colocar o item na nova linha
      itens.length = 0; // Limpa itens para a nova linha
    }
  }

  // Adiciona a última linha se houver itens não processados
  if (itens.length > 0) {
    linhas.push({ altura: alturaAtualLinha, itens: [...itens] });
    alturaTotal += alturaAtualLinha;
  }

  // Visualização do Layout
  console.log("Layout:");
  linhas.forEach((linha, index) => {
    console.log(`Linha ${index + 1} (Altura: ${linha.altura} cm):`);
    linha.itens.forEach((item, itemIndex) => {
      console.log(
        `  Item ${itemIndex + 1} - Posição (X: ${item.x}, Y: ${item.y}), Tamanho (Largura: ${item.largura}, Altura: ${item.altura}), Rotacionado: ${item.rotacionado}`
      );
    });
  });

  return {
    alturaNecessaria: alturaTotal,
    itensRotacionados: itensRotacionados,
    linhas,
  };
};

// Exemplo de uso:
const resultado = calcularEspacoOtimizado(28, 40, 200, 57, 1);
console.log('Altura Necessária:', resultado.alturaNecessaria, 'cm');
console.log('Itens Rotacionados:', resultado.itensRotacionados);
