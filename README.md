# Loja que responde

Aplicativo React Native com Expo Router para o Checkpoint 5.

## Como executar

1. Instale Node.js LTS.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL` se necessário.
4. Execute `npx expo start`.

O projeto usa Expo SDK 54, React Native 0.81.5 e Reanimated 4.

## Funcionalidades

- Produtos com média e contagem de avaliações vindas do produto.
- Lista de avaliações com estados de carregamento, erro, vazio e conteúdo.
- Avaliação com nota, comentário e upload opcional de imagem.
- Pontos de retirada com fallback quando localização é negada ou indisponível.
- Mapa com a loja e os pontos cadastrados.
- Checkout com seleção de ponto de retirada.
- Pedidos exibindo o ponto escolhido.
- Notificações locais pelo Caminho B, solicitadas no perfil.
- Animações de toque com suporte a Reduzir Movimento.

## Dados esperados da API

Cadastre no painel pelo menos três pontos de retirada, a localização da loja, um produto comprável e um pedido concluído para liberar avaliações. Os endpoints utilizados estão centralizados em `src/api/client.ts`.

## Movimento

As interações de toque usam `PressableScale`. A constante `ANIMATIONS_ENABLED` em `src/theme/motion.ts` permite desligar o movimento globalmente. Quando o sistema informa Reduzir Movimento, a mola é substituída por uma alteração instantânea de escala, preservando o feedback visual. A entrada escalonada de produtos possui teto para não atrasar listas grandes.

## Notificações

Foi escolhido o Caminho B por não exigir Firebase nem development build. Ao ativar a preferência no perfil, o app pede a permissão, cria o canal Android e consome `/push/messages`. Permissão negada não impede o uso do app e a tela oferece as configurações do sistema.

## Limitações conhecidas

- A API da turma precisa estar acessível e seguir os schemas descritos no Swagger.
- `react-native-maps` pode exigir configuração nativa de chave em um build Android específico.
- Login e autenticação dependem do ambiente da API; o cliente mantém os endpoints de negócio concentrados para a integração.
