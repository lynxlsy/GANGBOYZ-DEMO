// Utilitário para gerenciar conteúdos editáveis
export interface EditableContent {
  id: string;
  title: string;
  content: string;
}

export const getDefaultEditableContents = (): EditableContent[] => [
  {
    id: "explore-title",
    title: "Título Explore",
    content: "EXPLORE NA GANG BOYZ"
  },
  {
    id: "explore-categories",
    title: "Categorias Explore",
    content: "Oversized\nEstampas\nLisos\nShorts\nVerão\nInverno"
  },
  {
    id: "offers-title",
    title: "Título Ofertas",
    content: "OFERTAS"
  },
  {
    id: "recommendations-title",
    title: "Título Recomendações",
    content: "RECOMENDAÇÕÕES"
  },
  {
    id: "season-highlights-title",
    title: "Título Destaques da Temporada",
    content: "DESTAQUES DA TEMPORADA"
  },
  {
    id: "season-highlights-description",
    title: "Descrição Destaques da Temporada",
    content: "Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano"
  },
  {
    id: "about-title",
    title: "Título Sobre",
    content: "SOBRE A GANG BOYZ"
  },
  {
    id: "about-description",
    title: "Descrição Sobre",
    content: "Mais do que uma loja, uma referência no mercado quando falamos em excelência, trazemos as peças mais exclusivas e sempre estamos por dentro da moda atual para nossos clientes não ficarem para trás. Com +20 mil pedidos enviados, +15 mil clientes atendidos, +1000 envios todo mês, hoje não há dúvida que escolher a Gang Boyz é a escolha certa para seu guarda-roupa."
  },
  {
    id: "about-stats-orders",
    title: "Estatísticas Pedidos",
    content: "+20K\nPedidos Enviados\nMilhares de entregas realizadas"
  },
  {
    id: "about-stats-clients",
    title: "Estatísticas Clientes",
    content: "+15K\nClientes Atendidos\nPessoas que confiam na nossa marca"
  },
  {
    id: "about-stats-monthly",
    title: "Estatísticas Mensais",
    content: "+1K\nEnvios por Mês\nEntregas mensais garantidas"
  },
  {
    id: "mission-title",
    title: "Título Missão",
    content: "NOSSA MISSÃO"
  },
  {
    id: "mission-description",
    title: "Descrição Missão",
    content: "Ser a marca de streetwear mais autêntica do Brasil, representando a cultura urbana com qualidade, estilo e inovação. Queremos que cada peça conte uma história e que nossos clientes se sintam parte de uma comunidade que valoriza a expressão individual através da moda."
  },
  {
    id: "services",
    title: "Serviços",
    content: "ATENDIMENTO\nSegunda à sexta das 9h00 às 17h00\n\nTROCAS E DEVOLUÇÕES\nPrimeira troca é grátis\n\nFRETE\nGrátis acima de R$349\n\nPARCELAMENTO\nEm até 10x sem juros no cartão"
  },
  {
    id: "hot-title",
    title: "Título Produtos em Destaque",
    content: "PRODUTOS EM DESTAQUE"
  },
  {
    id: "hot-subtitle",
    title: "Subtítulo Produtos em Destaque",
    content: "Os produtos mais vendidos e em alta"
  },
  // Sobre Nós page content
  {
    id: "sobre-nos-missao",
    title: "Sobre Nós - Missão",
    content: "Nossa missão é revolucionar o streetwear brasileiro, trazendo autenticidade, estilo e qualidade para as ruas. Queremos representar a cultura urbana com roupas que expressem a verdadeira essência da juventude brasileira."
  },
  {
    id: "sobre-nos-visao",
    title: "Sobre Nós - Visão",
    content: "Ser a marca de referência em streetwear no Brasil, reconhecida pela qualidade dos produtos, autenticidade da marca e impacto positivo na cultura urbana."
  },
  {
    id: "sobre-nos-valores",
    title: "Sobre Nós - Valores",
    content: "• Autenticidade: Valorizamos a verdadeira cultura urbana\n• Qualidade: Comprometidos com materiais e acabamentos excelentes\n• Inovação: Sempre buscando novas tendências e designs\n• Comunidade: Fortalecendo laços com nossa comunidade"
  },
  {
    id: "sobre-nos-historia",
    title: "Sobre Nós - História",
    content: "Fundada em 2020 por um grupo de amigos apaixonados pela cultura urbana, a Gang Boyz nasceu nas ruas de São Paulo. Começamos com poucas peças e muito estilo, e hoje somos uma das marcas de streetwear mais reconhecidas do Brasil."
  },
  // Política de Privacidade page content
  {
    id: "politica-privacidade-content",
    title: "Política de Privacidade",
    content: `POLÍTICA DE PRIVACIDADE

A Gang Boyz valoriza a privacidade e a proteção dos dados pessoais de seus clientes. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você visita nosso site ou utiliza nossos serviços.

1. INFORMAÇÕES COLETADAS

Coletamos informações pessoais que você nos fornece diretamente, como:
- Nome completo
- Endereço de e-mail
- Número de telefone
- Endereço postal
- Informações de pagamento
- Preferências de produtos

Também coletamos automaticamente informações técnicas, como:
- Endereço IP
- Tipo de navegador
- Páginas visitadas
- Tempo de permanência no site

2. USO DAS INFORMAÇÕES

Utilizamos suas informações para:
- Processar pedidos e entregas
- Personalizar sua experiência de compra
- Enviar comunicações sobre produtos e promoções
- Melhorar nosso site e serviços
- Cumprir obrigações legais

3. COMPARTILHAMENTO DE INFORMAÇÕES

Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros, exceto:
- Prestadores de serviço que nos auxiliam na operação do site
- Empresas de entrega para processar seus pedidos
- Autoridades legais quando exigido por lei

4. SEGURANÇA DE DADOS

Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos tecnologia de criptografia SSL para proteger dados sensíveis durante transmissões.

5. COOKIES E TECNOLOGIAS DE RASTREAMENTO

Utilizamos cookies e tecnologias similares para:
- Melhorar a navegação no site
- Lembrar suas preferências
- Analisar o tráfego do site
- Personalizar conteúdo e anúncios

Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.

6. DIREITOS DO TITULAR

Você tem o direito de:
- Acessar suas informações pessoais
- Corrigir dados incorretos
- Solicitar a exclusão de seus dados
- Revogar consentimentos
- Portabilidade dos dados

7. RETENÇÃO DE DADOS

Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, exceto quando exigido por lei.

8. ALTERAÇÕES NESTA POLÍTICA

Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através do site ou por e-mail.

9. CONTATO

Para dúvidas sobre esta Política de Privacidade, entre em contato conosco:
E-mail: privacidade@gangboyz.com.br
Telefone: (11) 99999-9999`
  },
  // Termos de Uso page content
  {
    id: "termos-uso-content",
    title: "Termos de Uso",
    content: `TERMOS DE USO

Bem-vindo à Gang Boyz! Ao acessar e utilizar nosso site, você concorda em cumprir os seguintes termos e condições:

1. ACEITAÇÃO DOS TERMOS

Ao acessar este site, você concorda com estes termos de uso, todas as leis e regulamentos aplicáveis, e reconhece que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.

2. DIREITOS DE PROPRIEDADE INTELECTUAL

Todo o conteúdo deste site, incluindo textos, gráficos, logotipos, ícones, imagens, arquivos de áudio e vídeo, é de propriedade exclusiva da Gang Boyz ou de seus licenciadores e é protegido pelas leis de direitos autorais brasileiras e internacionais.

3. USO DO SITE

Você pode visualizar e imprimir partes do conteúdo apenas para uso pessoal e não comercial. Você não pode:
- Reproduzir, duplicar, copiar ou revender qualquer parte do site
- Modificar ou adaptar qualquer parte do site
- Usar o site de forma que possa danificar ou tornar indisponível para outros usuários

4. REGISTRO DE CONTA

Para realizar compras, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade de sua conta e senha, e por restringir o acesso ao seu computador. Você concorda em aceitar responsabilidade por todas as atividades que ocorram sob sua conta.

5. PREÇOS E PAGAMENTO

Todos os preços estão em Reais (BRL) e podem ser alterados a qualquer momento sem aviso prévio. O pagamento pode ser realizado através dos meios disponíveis no site no momento da compra.

6. POLÍTICA DE TROCAS E DEVOLUÇÕES

Nossas políticas de trocas e devoluções estão detalhadas em nossa Política de Trocas e Devoluções, que faz parte integrante destes Termos de Uso.

7. LIMITAÇÃO DE RESPONSABILIDADE

A Gang Boyz não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou incapacidade de usar o site.

8. ALTERAÇÕES NOS TERMOS

Reservamo-nos o direito de modificar estes termos de uso a qualquer momento. As alterações serão publicadas nesta página e entrarão em vigor imediatamente após a publicação.

9. LEI APLICÁVEL

Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais competentes do Estado de São Paulo.

10. CONTATO

Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
E-mail: termos@gangboyz.com.br
Telefone: (11) 99999-9999`
  },
  // FAQ page content
  {
    id: "faq-content",
    title: "Perguntas Frequentes",
    content: `PERGUNTAS FREQUENTES

1. COMO FAÇO PARA REALIZAR UMA COMPRA?

Para realizar uma compra, basta navegar pelo nosso site, selecionar os produtos desejados, adicioná-los ao carrinho e seguir o processo de checkout. Você precisará criar uma conta ou fazer login para finalizar a compra.

2. QUAIS SÃO AS FORMAS DE PAGAMENTO ACEITAS?

Aceitamos as seguintes formas de pagamento:
- Cartões de crédito (Visa, Mastercard, American Express, Elo, Hipercard)
- Boleto bancário
- PIX

3. QUAL O PRAZO PARA ENTREGA?

O prazo de entrega varia de acordo com a região e o tipo de frete selecionado:
- Frete Expresso: 1-3 dias úteis
- Frete Padrão: 3-7 dias úteis
- Frete Econômico: 7-15 dias úteis

4. POSSO TROCAR OU DEVOLVER UM PRODUTO?

Sim, oferecemos trocas e devoluções dentro do prazo de 30 dias após o recebimento do produto, desde que esteja em perfeitas condições, com etiquetas e embalagem original. A primeira troca é gratuita.

5. OS PRODUTOS POSSUEM GARANTIA?

Todos os nossos produtos possuem garantia de fabricação contra defeitos de material e acabamento. O prazo de garantia varia de acordo com o tipo de produto.

6. COMO ACOMPANHO MEU PEDIDO?

Após a confirmação do pagamento, você receberá um e-mail com o código de rastreio do seu pedido. Também é possível acompanhar o status do pedido na seção "Meus Pedidos" da sua conta.

7. OS PRODUTOS SÃO AUTÊNTICOS?

Sim, todos os produtos comercializados pela Gang Boyz são originais e autênticos. Trabalhamos diretamente com marcas e fornecedores autorizados.

8. QUAL O TAMANHO DOS PRODUTOS?

Disponibilizamos tabelas de medidas detalhadas para cada produto. Recomendamos verificar as medidas antes de realizar a compra. Em caso de dúvidas, entre em contato com nosso atendimento.

9. É POSSÍVEL ALTERAR OU CANCELAR MEU PEDIDO?

Pedidos podem ser alterados ou cancelados antes do envio. Após o envio, segue o processo normal de troca ou devolução. Entre em contato com nosso atendimento o quanto antes para solicitar alterações.

10. COMO ENTRO EM CONTATO COM O ATENDIMENTO AO CLIENTE?

Você pode entrar em contato conosco através dos seguintes canais:
- E-mail: contato@gangboyz.com.br
- WhatsApp: (11) 99999-9999
- Telefone: (11) 99999-9999
- Formulário de contato no site

Horário de atendimento: Segunda a Sexta, das 9h às 18h.`
  },
  // Contato page content
  {
    id: "contato-content",
    title: "Contato",
    content: `CONTATO

Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo:

INFORMAÇÕES DE CONTATO

E-mail: contato@gangboyz.com.br
Telefone: (11) 99999-9999
WhatsApp: (11) 99999-9999

Horário de Atendimento:
Segunda a Sexta: 9h às 18h
Sábado: 10h às 16h

ENDEREÇO

Rua Exemplo, 123
São Paulo - SP
CEP: 01234-567

REDES SOCIAIS

Instagram: @gangboyz
Facebook: /gangboyz
Twitter: @gangboyz

FORMULÁRIO DE CONTATO

Você também pode nos enviar uma mensagem diretamente através do formulário abaixo:

[NOME COMPLETO]
[E-MAIL]
[TELEFONE]
[ASSUNTO]
[MENSAGEM]

[ENVIAR MENSAGEM]

NOSSA LOCALIZAÇÃO

[MAPA EMBEDDED]

POLÍTICA DE RESPOSTAS

Nos comprometemos a responder todas as mensagens em até 24 horas úteis. Para solicitações urgentes, recomendamos o contato via WhatsApp.

SUPORTE AO CLIENTE

Para questões relacionadas a pedidos, trocas, devoluções ou suporte técnico, entre em contato com nosso departamento especializado:

E-mail: suporte@gangboyz.com.br
Telefone: (11) 98888-8888

ATENDIMENTO PERSONALIZADO

Para parceiros, influenciadores ou assuntos comerciais, entre em contato com nossa equipe dedicada:

E-mail: parceiros@gangboyz.com.br
Telefone: (11) 97777-7777`
  }
];

// Add new functions to fetch content from backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Fetch content from backend
export const fetchBackendContents = async (): Promise<EditableContent[] | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/content`);
    if (response.ok) {
      const data = await response.json();
      return Object.keys(data).map(id => ({
        id,
        title: id, // In a real implementation, you might want to store titles separately
        content: data[id]
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching content from backend:', error);
    return null;
  }
};

// Save content to backend
export const saveContentToBackend = async (id: string, content: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error saving content to backend:', error);
    return false;
  }
};

// Modified loadEditableContents to check backend first
export const loadEditableContents = async (): Promise<EditableContent[]> => {
  if (typeof window === 'undefined') return getDefaultEditableContents();
  
  // Try to fetch from backend first
  const backendContents = await fetchBackendContents();
  if (backendContents && backendContents.length > 0) {
    // Save backend contents to localStorage for offline access
    try {
      localStorage.setItem("gang-boyz-editable-contents", JSON.stringify(backendContents));
    } catch (error) {
      console.error('Error saving backend contents to localStorage:', error);
    }
    return backendContents;
  }
  
  // Fall back to localStorage if backend is not available
  const savedContents = localStorage.getItem("gang-boyz-editable-contents");
  if (savedContents) {
    try {
      const parsedContents = JSON.parse(savedContents);
      // Merge with default contents to ensure all IDs are present
      const defaultContents = getDefaultEditableContents();
      const mergedContents = [...parsedContents];
      
      // Add any missing default contents
      defaultContents.forEach(defaultItem => {
        const exists = parsedContents.some((item: EditableContent) => item.id === defaultItem.id);
        if (!exists) {
          mergedContents.push(defaultItem);
        }
      });
      
      return mergedContents;
    } catch (error) {
      console.error('Erro ao fazer parse dos conteúdos editáveis:', error);
      return getDefaultEditableContents();
    }
  }
  
  // If no saved contents, return and save default contents
  const defaultContents = getDefaultEditableContents();
  localStorage.setItem("gang-boyz-editable-contents", JSON.stringify(defaultContents));
  return defaultContents;
};

// Modified saveEditableContents to save to both localStorage and backend
export const saveEditableContents = async (contents: EditableContent[]): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    // Save to localStorage
    localStorage.setItem("gang-boyz-editable-contents", JSON.stringify(contents));
    
    // Try to save to backend
    const savePromises = contents.map(item => 
      saveContentToBackend(item.id, item.content)
    );
    
    await Promise.allSettled(savePromises);
    
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('editableContentsUpdated'));
  } catch (error) {
    console.error('Erro ao salvar conteúdos editáveis:', error);
  }
};

// Modified updateContentById to save to backend
export const updateContentById = async (id: string, content: string): Promise<void> => {
  const contents = await loadEditableContents();
  const updatedContents = contents.map(item => 
    item.id === id ? {...item, content} : item
  );
  await saveEditableContents(updatedContents);
  
  // Also save individually to backend
  await saveContentToBackend(id, content);
};

// Keep the synchronous version for backward compatibility
export const loadEditableContentsSync = (): EditableContent[] => {
  if (typeof window === 'undefined') return getDefaultEditableContents();
  
  const savedContents = localStorage.getItem("gang-boyz-editable-contents");
  if (savedContents) {
    try {
      const parsedContents = JSON.parse(savedContents);
      // Merge with default contents to ensure all IDs are present
      const defaultContents = getDefaultEditableContents();
      const mergedContents = [...parsedContents];
      
      // Add any missing default contents
      defaultContents.forEach(defaultItem => {
        const exists = parsedContents.some((item: EditableContent) => item.id === defaultItem.id);
        if (!exists) {
          mergedContents.push(defaultItem);
        }
      });
      
      return mergedContents;
    } catch (error) {
      console.error('Erro ao fazer parse dos conteúdos editáveis:', error);
      return getDefaultEditableContents();
    }
  }
  
  // If no saved contents, return and save default contents
  const defaultContents = getDefaultEditableContents();
  localStorage.setItem("gang-boyz-editable-contents", JSON.stringify(defaultContents));
  return defaultContents;
};

// Keep the synchronous version for backward compatibility
export const saveEditableContentsSync = (contents: EditableContent[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem("gang-boyz-editable-contents", JSON.stringify(contents));
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('editableContentsUpdated'));
  } catch (error) {
    console.error('Erro ao salvar conteúdos editáveis:', error);
  }
};

// Keep the synchronous version for backward compatibility
export const updateContentByIdSync = (id: string, content: string): void => {
  const contents = loadEditableContentsSync();
  const updatedContents = contents.map(item => 
    item.id === id ? {...item, content} : item
  );
  saveEditableContentsSync(updatedContents);
};

export const getContentById = (id: string): string | undefined => {
  const contents = loadEditableContentsSync();
  const item = contents.find(item => item.id === id);
  return item ? item.content : undefined;
};

// Async version of getContentById
export const getContentByIdAsync = async (id: string): Promise<string | undefined> => {
  const contents = await loadEditableContents();
  const item = contents.find(item => item.id === id);
  return item ? item.content : undefined;
};

// Async version of updateContentById
export const updateContentByIdAsync = async (id: string, content: string): Promise<void> => {
  const contents = await loadEditableContents();
  const updatedContents = contents.map(item => 
    item.id === id ? {...item, content} : item
  );
  await saveEditableContents(updatedContents);
  
  // Also save individually to backend
  await saveContentToBackend(id, content);
};
