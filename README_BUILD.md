# 🚀 Como Gerar o Executável (.exe)

## Pré-requisitos

1. **Node.js** instalado (versão 14 ou superior)
   - Download: https://nodejs.org/

2. **Neutralino CLI** instalado globalmente
   ```bash
   npm install -g @neutralinojs/neu
   ```

## Passos para Gerar o .exe

### Opção 1: Usando o Script Automático (Recomendado)

1. Execute o arquivo `build.bat`:
   ```bash
   build.bat
   ```

2. O executável será gerado em: `dist\analiseEnem\analiseEnem-win_x64.exe`

### Opção 2: Comandos Manuais

1. Abra o terminal no diretório do projeto

2. Execute o build:
   ```bash
   neu build
   ```

3. O executável estará em: `dist\analiseEnem\`

## Estrutura de Arquivos Gerados

```
dist/
└── analiseEnem/
    ├── analiseEnem-win_x64.exe     ← Executável principal (Windows)
    ├── resources.neu                ← Recursos do app
    ├── WebView2Loader.dll          ← DLL do WebView2 (necessário)
    └── storage/                    ← Pasta de dados do app
```

## Distribuição

Para distribuir seu aplicativo, você precisa incluir:

1. ✅ `analiseEnem-win_x64.exe`
2. ✅ `resources.neu`
3. ✅ `WebView2Loader.dll`
4. ✅ Pasta `storage/` (para dados persistentes)

**Importante:** O usuário final precisa ter o **Microsoft Edge WebView2** instalado no Windows. A maioria dos sistemas Windows 10/11 já tem instalado por padrão.

## Testando o Executável

Após o build, você pode testar executando:
```bash
cd dist\analiseEnem
analiseEnem-win_x64.exe
```

## Personalizações Adicionais

### Adicionar Ícone Personalizado

1. Crie um arquivo `icon.png` (256x256px ou maior)
2. Coloque na raiz do projeto
3. O build automaticamente usará o ícone

### Criar Instalador

Para criar um instalador profissional, você pode usar ferramentas como:
- **Inno Setup** (gratuito)
- **NSIS** (gratuito)
- **Advanced Installer** (pago)

## Troubleshooting

### Erro: "neu command not found"
```bash
npm install -g @neutralinojs/neu
```

### Erro ao executar o .exe
- Verifique se o antivírus não está bloqueando
- Certifique-se de que o WebView2 está instalado
- Execute como administrador se necessário

### Dados não estão sendo salvos
- A pasta `storage/` deve estar no mesmo diretório do .exe
- Verifique permissões de escrita na pasta

## Estrutura do Projeto

```
analiseEnem/
├── index.html              ← Página principal
├── autodiagnostico.html    ← Página de autodiagnóstico
├── main.js                 ← Lógica do calendário
├── style.css               ← Estilos
├── neutralino.config.json  ← Configuração do Neutralino
├── build.bat              ← Script de build
└── dist/                  ← Pasta gerada com o executável
```

## Comandos Úteis

```bash
# Build do projeto
neu build

# Executar em modo desenvolvimento
neu run

# Atualizar Neutralino
npm update -g @neutralinojs/neu

# Ver versão do Neutralino
neu version
```

## Suporte

Para mais informações sobre Neutralino:
- Documentação: https://neutralino.js.org/docs/
- GitHub: https://github.com/neutralinojs/neutralinojs
