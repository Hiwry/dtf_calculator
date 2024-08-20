export const adicionarTamanho = (largura, altura, setItems, sectionCount, setSectionCount) => {
  const newSectionCount = sectionCount + 1;
  const newItem = {
    id: newSectionCount,
    largura: largura,
    altura: altura,
    quantidade: 1
  };
  setItems(prevItems => [...prevItems, newItem]);
  setSectionCount(newSectionCount);
};

export const adicionarSecao = (setItems, sectionCount, setSectionCount) => {
  const newSectionCount = sectionCount + 1;
  const newItem = {
    id: newSectionCount,
    largura: '',
    altura: '',
    quantidade: 1
  };
  setItems(prevItems => [...prevItems, newItem]);
  setSectionCount(newSectionCount);
};

export const removerSecao = (id, setItems) => {
  setItems(prevItems => prevItems.filter(item => item.id !== id));
};

export const atualizarSecao = (id, campo, valor, setItems) => {
  setItems(prevItems =>
    prevItems.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    )
  );
};

export const calcularAltura = (items) => {
  let alturaTotal = 0;
  items.forEach(item => {
    const quantidade = parseInt(item.quantidade, 10);
    const larguraItem = parseFloat(item.largura);
    const alturaItem = parseFloat(item.altura);
    if (!isNaN(quantidade) && !isNaN(larguraItem) && !isNaN(alturaItem)) {
      const alturaNecessaria = quantidade * alturaItem;
      alturaTotal += alturaNecessaria;
    }
  });
  return `Altura Total: ${alturaTotal.toFixed(2)} cm`;
};
