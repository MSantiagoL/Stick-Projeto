const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Caminho do Banco de Dados - AJUSTADO PARA SER MAIS SEGURO
const DB_PATH = path.join(__dirname, '../../database.json');

// Função para garantir que o banco de dados existe e tem a estrutura correta
const inicializarBanco = () => {
    if (!fs.existsSync(DB_PATH)) {
        console.log("📝 Criando novo arquivo database.json...");
        fs.writeFileSync(DB_PATH, JSON.stringify({ posts: [] }, null, 2));
    }
};
inicializarBanco();

// 2. Garante que a pasta uploads existe
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use('/uploads', express.static(uploadsPath));

// 3. Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// --- ROTAS ---

app.get('/posts', (req, res) => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const db = JSON.parse(data);
        res.json(db.posts || []);
    } catch (error) {
        console.error("❌ Erro ao ler database.json:", error);
        res.status(500).json({ erro: "Não foi possível carregar os posts." });
    }
});

app.post('/postar', upload.single('foto'), (req, res) => {
    try {
        const { legenda } = req.body;
        
        if (!req.file) {
            console.error("❌ Nenhuma foto recebida.");
            return res.status(400).json({ erro: "Selecione uma imagem!" });
        }

        // URL que o navegador usará para exibir a foto
        const fotoUrl = `http://localhost:3000/uploads/${req.file.filename}`;

        const data = fs.readFileSync(DB_PATH, 'utf8');
        const db = JSON.parse(data);

        const novoPost = {
            id: Date.now(),
            url: fotoUrl,
            legenda: legenda || "",
            comentarios: []
        };

        db.posts.unshift(novoPost); 
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

        console.log("✅ Post salvo com sucesso!");
        res.json(novoPost);

    } catch (error) {
        console.error("❌ ERRO NO SERVIDOR:", error);
        res.status(500).json({ erro: "Erro interno ao salvar." });
    }
});

app.listen(3000, () => {
    console.log("🚀 Servidor do Stick online em http://localhost:3000");
    console.log("📂 Local do Banco:", DB_PATH);
});