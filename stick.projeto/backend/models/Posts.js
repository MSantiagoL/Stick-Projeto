// Este arquivo define como um Post será salvo no banco de dados
const postSchema = {
    imageUrl: String,    // O link da foto que você subiu
    caption: String,     // A sua legenda emocionante
    createdAt: Date,     // O dia e hora da postagem
    userId: String       // Quem postou (você!)
};

// No futuro, conectaremos isso ao banco de dados real
console.log("Model de Postagem configurado com sucesso! 🚀");