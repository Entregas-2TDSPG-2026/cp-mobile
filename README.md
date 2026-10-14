# Loja que Responde

Aplicativo mobile de e-commerce sustentável desenvolvido em React Native com Expo Router para o Checkpoint 5. A experiência permite descobrir produtos, consultar avaliações, escolher um ponto de retirada, finalizar pedidos e receber notificações locais.

## Integrantes

| Nome | RM |
| --- | --- |
| Arthur Brito da Silva | RM562085 |
| Luiz Felipe Flosi dos Santos | RM563197 |
| Pedro Henrique Brum Lopes | RM561780 |

## Visão geral

O projeto combina um catálogo de produtos reutilizáveis com uma jornada completa de compra:

1. O usuário navega pelo catálogo e abre os detalhes do produto.
2. Consulta a nota média e as avaliações existentes.
3. Cria uma conta ou entra com uma conta existente.
4. Adiciona a variante comprável ao carrinho.
5. Escolhe um ponto de retirada, com ordenação por distância quando a localização é autorizada.
6. Finaliza o pedido e acompanha seus dados na área de pedidos.
7. Após uma compra concluída, pode publicar uma avaliação com nota, comentário e imagem opcional.

## Tecnologias

- Expo SDK 54 e Expo Router 6.
- React Native 0.81.5 e React 19.
- TypeScript.
- TanStack Query para cache, carregamento e invalidação de dados.
- Reanimated para microinterações e transições.
- `react-native-maps` para o mapa nativo.
- Expo Location, Image Picker, Notifications e Device.
- AsyncStorage para persistência da sessão local.
- API Mockmerce da turma, autenticada por `X-API-Key` e Bearer token.

## Como executar

### Pré-requisitos

- Node.js LTS.
- npm.
- Expo CLI via `npx`.
- Em um dispositivo físico, Expo Go ou um development build compatível com os recursos nativos.

### Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e preencha:

```env
EXPO_PUBLIC_API_URL=https://api.mockmerce.com.br/v1
EXPO_PUBLIC_API_KEY=sua-chave-do-painel
```

Nunca adicione `.env` ou qualquer chave real ao Git. A variável `EXPO_PUBLIC_API_KEY` é necessária para as chamadas da API.

### Execução

```bash
npx expo start
```

Comandos úteis:

```bash
npx expo start -c
npm run lint
npx tsc --noEmit
npx expo-doctor
npx expo export --platform web
```

## Funcionalidades implementadas

### Catálogo e produto

- Catálogo autenticado com produtos sustentáveis.
- Imagens vindas da API.
- Detalhe do produto com preço, descrição, variantes e nota média.
- Estados de carregamento, erro, vazio e conteúdo.
- Cards com feedback de toque e entrada animada.

### Avaliações

- Lista de avaliações com média, contagem e distribuição de notas.
- Verificação `can-review` antes do envio.
- Nota de 1 a 5 estrelas e comentário.
- Upload opcional de imagem.
- Tratamento de permissão de galeria negada sem bloquear o formulário.
- Atualização da lista após o envio.
- A API contém seis avaliações de demonstração para cada um dos quatro produtos publicados.

### Conta, carrinho e checkout

- Cadastro e login de cliente.
- Sessão persistida localmente.
- Logout e consulta do perfil autenticado.
- Adição da variante padrão ao carrinho real da API.
- Checkout com ponto de retirada.
- Lista de pedidos com status, total e local escolhido.

### Retirada e localização

- Solicitação contextual de localização.
- Ordenação dos pontos por distância.
- Fallback quando a permissão é negada, o GPS está indisponível ou ocorre timeout.
- Três pontos de retirada cadastrados para demonstração em São Paulo.
- Mapa nativo com `react-native-maps`.
- Fallback web para manter a aplicação navegável no navegador.

### Notificações

Foi implementado o Caminho B, sem Firebase e sem exigir development build para o fluxo principal:

- Permissão solicitada a partir da tela de perfil.
- Canal Android configurado.
- Consumo de `/push/messages`.
- Tratamento de permissão negada.
- Deep link para o produto ao tocar na notificação.
- Tratamento de abertura com o aplicativo fechado.
- Implementação neutra no web para evitar uso indevido de APIs nativas.

### Movimento e acessibilidade

- `PressableScale` para feedback de toque.
- Skeleton loading com pulse.
- Entrada escalonada dos produtos.
- Transições de remoção e acomodação de pedidos.
- Respeito à configuração do sistema Reduzir Movimento.
- Constante global `ANIMATIONS_ENABLED` em `src/theme/motion.ts`.

## Dados preparados na API

O ambiente da turma foi preparado com:

- Kit de Sacolas Reutilizáveis.
- Escova de Dentes de Bambu.
- Potes Herméticos de Vidro.
- Eco Bag de Algodão Orgânico.
- Imagens principais associadas aos produtos.
- Três pontos de retirada ativos.
- Seis avaliações por produto, totalizando 24 avaliações.

Os endpoints e a normalização dos envelopes da API estão centralizados em `src/api/client.ts`. O Swagger da API é a referência para os contratos de autenticação, catálogo, carrinho, pedidos, retirada e avaliações.

## Estrutura principal

```text
app/
├── (tabs)/             # Catálogo e área da conta
├── auth.tsx            # Login e cadastro
├── checkout.tsx        # Carrinho, retirada e finalização
├── orders.tsx          # Histórico de pedidos
├── pickup.tsx          # Localização e pontos de retirada
├── product/[id].tsx    # Detalhe do produto
├── profile.tsx         # Permissões e notificações
└── reviews/[id].tsx    # Avaliações

src/
├── api/                # Cliente HTTP e tipos da API
├── auth/               # Persistência da sessão
├── components/         # Componentes reutilizáveis e mapa
├── hooks/              # Hooks de movimento
├── providers/          # QueryClient e serviços globais
├── services/           # Notificações
└── theme/              # Cores, tokens e animações
```

## Checklist do checkpoint

- **RF-35 a RF-42:** produto, avaliações, `can-review`, upload opcional e invalidação implementados.
- **RF-43 a RF-48:** localização, fallback, pontos, mapa nativo/fallback web e retirada implementados.
- **RF-49 a RF-55 e RF-62:** mola, feedback, entrada escalonada, skeleton, remoção com layout, acessibilidade e tokens centralizados.
- **RF-56 a RF-60:** notificações locais, canal Android, permissão contextual, payload, deep link e fallback implementados.
- **RF-61:** identidade visual própria centralizada nos tokens do app.

## Validação

Antes da entrega, foram executados:

- `npx tsc --noEmit`.
- `npm run lint`.
- `npx expo-doctor`, com 18/18 verificações aprovadas.
- `npx expo export --platform web`.
- `git diff --check`.
- Testes reais dos endpoints de produtos, imagens, avaliações, carrinho, checkout e pontos de retirada.
