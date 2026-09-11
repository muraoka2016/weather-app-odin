# Odin Weather

Projeto desenvolvido como parte do currículo do [The Odin Project](https://www.theodinproject.com/).
O objetivo é praticar consumo de APIs, JavaScript assíncrono, manipulação do DOM,
webpack e estilização responsiva criando uma aplicação de previsão do tempo.

## Funcionalidades

- Busca de cidades com sugestões automáticas após a digitação.
- Debounce de 400 ms nas consultas de sugestões para evitar requisições
  desnecessárias.
- Exibição do clima atual da cidade pesquisada.
- Previsão dos quatro próximos dias, com:
  - data;
  - ícone e condições climáticas;
  - temperaturas mínima e máxima;
  - umidade;
  - probabilidade de chuva.
- Alternância das temperaturas entre Celsius e Fahrenheit.
- Interface responsiva para dispositivos menores.
- Estados de carregamento e mensagens para cidades não encontradas ou erros.

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES modules)
- Webpack
- Visual Crossing Weather API
- Open-Meteo Geocoding API

## Como executar

### Pré-requisitos

- Node.js instalado.
- Uma chave da Visual Crossing Weather API.

### Instalação

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com a chave da API:

```env
WEATHER_API_KEY=sua_chave_aqui
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

O projeto ficará disponível em `http://localhost:3000`.

Para gerar uma versão de produção:

```bash
npm run build
```

O arquivo `.env` não deve ser versionado, pois contém uma credencial de API.

## Deploy na Vercel

O projeto já inclui a configuração necessária em `vercel.json`. Ao importar o
repositório na Vercel, use os valores padrão detectados ou confirme:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Antes do deploy, adicione `WEATHER_API_KEY` como variável de ambiente do projeto
na Vercel. A variável é usada durante o build pelo `dotenv-webpack`.
