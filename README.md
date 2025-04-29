
# Challenge Mottu - FIAP 2025

## Integrantes
- **Lu Vieira Santos** - RM: 558935
- **Melissa Perreira** - RM: 555656
- **Diego Furigo do Nascimento** - RM: 555656

---

## Sobre o Projeto

A Mottu, startup que aluga motos para entregadores, enfrenta um desafio de **desorganização nos pátios** de suas mais de 100 filiais no Brasil e México. Atualmente, a localização é feita de forma manual, gerando erros, atrasos e dificultando a escalabilidade.

Nossa solução é um **sistema completo de mapeamento inteligente de pátios e gestão de motos**, dividido em três módulos principais:

### Módulos Desenvolvidos

1. **Organização e Digitalização das Zonas**
   - Dividimos o pátio em zonas (ex: A1, B2, C3).
   - Criamos um app mobile para cadastro e edição das motos.

2. **Localização BLE Simulada (Bluetooth)**
   - Cada moto simula o envio de sinal Bluetooth.
   - Um receptor (ESP32 no MVP) capta o sinal para indicar a zona aproximada.

3. **Visualização Digital do Pátio**
   - Interface visual no app mostrando zonas e motos cadastradas.
   - Consulta rápida de placas, status e localização.

### Tecnologias Utilizadas
- **React Native + Expo Router (TypeScript)** - Front-end mobile
- **AsyncStorage** - Armazenamento local offline das motos
- **Context API** - Gerenciamento de estados globais (BLEContext e MotoContext)
- **TailwindCSS (nativo)** - Estilização responsiva
- **BLE (simulado)** - Preparo para futuras integrações reais

### Benefícios da Solução
- **Organização Imediata** dos pátios.
- **Redução de Erros Humanos**.
- **Localização quase Automática** de motos.
- **Sistema escalável**, preparado para BLE real, RFID e UWB.

---

## Instruções para Rodar o Projeto Localmente

### 1. Clone o repositório
```bash
https://github.com/seu-repositorio/project-mottu
```

### 2. Instale as dependências
```bash
npm install


### 3. Rode o projeto
```bash
npx expo start

### 4. Abra no dispositivo
- Utilize o aplicativo **Expo Go** no seu celular.
- Escaneie o QR Code gerado no terminal.

### 5. Credenciais
Não é necessário login. Todo o projeto roda 100% localmente.

---

## Estrutura do Projeto

```
project/
├── app/              # Rotas (definidas automaticamente pelo Expo Router)
│   ├── _layout.tsx     # Layout global
│   ├── +not-found.tsx  # Página 404
│   ├── index.tsx       # Tela Home
│   ├── register-moto.tsx # Cadastro de motos
│   ├── edit-moto.tsx     # Edição de motos
│   └── (tabs)/       # Grupo de abas (Mapa, Histórico, Configurações)
├── context/         # BLEContext e MotoContext
├── assets/          # Imagens e ícones
├── package.json      # Dependências e scripts
└── README.md         # Documentação
```

---

## Observações Finais

Este projeto é um **MVP** desenvolvido com foco em escalabilidade, custo reduzido e pré-visualização da solução real para a Mottu.

Futuramente, a integração com tecnologias como **UWB** ou **RFID ativo** tornará o sistema ainda mais preciso e automático.

---

Feito com ❤️ para o desafio FIAP & Mottu 2025 🚀
