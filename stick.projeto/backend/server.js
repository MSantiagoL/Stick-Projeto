const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 1. Criar a pasta 'uploads' automaticamente se ela não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());

// 2. Configuração do Multer para salvar as fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 3. Rota de teste
app.get('/', (req, res) => {
    res.send('O Cérebro do Stick está vivo! 🧠');
});

// 4. ROTA CORRIGIDA PARA POSTAGEM
app.post('/postar', upload.single('foto'), (req, res) => {
    try {
        const legenda = req.body.legenda;
        const foto = req.file;

        console.log("Legenda recebida:", legenda);
        console.log("Foto salva em:", foto ? foto.path : "Nenhuma foto");

        res.json({ mensagem: "Postagem recebida com sucesso no Cérebro! 🚀" });
    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ mensagem: "Erro interno no cérebro." });
    }
});

app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});