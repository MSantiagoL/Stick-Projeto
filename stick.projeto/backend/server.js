// Importando as ferramentas necessárias (Node.js)
const express = require('express');
const app = express();
const PORT = 3000;

// Configuração para o servidor entender JSON (dados de texto)
app.use(express.json());

// Rota de teste: Digite http://localhost:3000 no navegador para ver se o cérebro ligou
app.get('/', (req, res) => {
    res.send('O Cérebro do Stick está funcionando! 🧠🇧🇷');
});

// Simulação de recebimento de postagem
app.post('/postar', (req, res) => {
    const { legenda, imagem } = req.body;
    console.log("Recebendo nova postagem...");
    console.log("Legenda:", legenda);
    
    // Aqui no futuro o código salva no Banco de Dados
    res.status(201).json({ mensagem: "Postagem salva com sucesso no servidor!" });
});

// Liga o servidor
app.listen(PORT, () => {
    console.log(`Servidor do Stick rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});