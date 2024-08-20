const calcularEspacoOtimizado = (larguraItem, alturaItem, quantidade, larguraFixa, margem) => {
  const itens = [];

  let x = 0;
  let y = 0;
  let linhaMaxHeight = 0;

  for (let i = 0; i < quantidade; i++) {
    if (x + larguraItem > larguraFixa) {
      x = 0;
      y += linhaMaxHeight + margem;
      linhaMaxHeight = 0;
    }

    itens.push({ x, y, largura: larguraItem, altura: alturaItem });

    x += larguraItem + margem;
    linhaMaxHeight = Math.max(linhaMaxHeight, alturaItem);
  }

  const alturaNecessaria = y + linhaMaxHeight;

  return {
    alturaNecessaria,
    itens,
    rotacionado: false,
  };
};

export default calcularEspacoOtimizado;
