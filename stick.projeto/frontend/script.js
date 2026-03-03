// --- GERENCIAMENTO DO MODAL ---
const modal = document.getElementById('modalPost');

function abrirModal() {
    if (modal) {
        modal.style.display = 'flex';
    }
}

function fecharModal() {
    if (modal) {
        modal.style.display = 'none';
        
        // RESET COMPLETO: Limpa tudo para a próxima foto
        const preview = document.getElementById('imagePreview');
        const uploadText = document.getElementById('uploadText');
        const fileInput = document.getElementById('fileInput');
        const caption = document.getElementById('postCaption');
        const icon = document.querySelector('.upload-area i');

        if (preview) {
            preview.style.display = 'none';
            preview.src = "";
        }
        if (uploadText) uploadText.style.display = 'block';
        if (icon) icon.style.display = 'block';
        if (fileInput) fileInput.value = ""; // Limpa o arquivo selecionado
        if (caption) caption.value = ""; // Limpa o texto
    }
}

// Fechar se clicar fora da caixa
window.onclick = function (event) {
    if (event.target == modal) {
        fecharModal();
    }
}

// --- FUNÇÃO DE PRÉVIA DA FOTO ---
function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();

    if (input.files && input.files[0]) {
        reader.onload = function (e) {
            const output = document.getElementById('imagePreview');
            const text = document.getElementById('uploadText');
            const icon = document.querySelector('.upload-area i');

            if (output) {
                output.src = e.target.result;
                output.style.display = 'block';
            }
            if (text) text.style.display = 'none';
            if (icon) icon.style.display = 'none';
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// --- FUNÇÃO DE PUBLICAR (AGORA CONECTADA AO BACKEND) ---
async function publicarPost() {
    const fileInput = document.getElementById('fileInput');
    const captionInput = document.getElementById('postCaption');
    const preview = document.getElementById('imagePreview');

    // 1. Validação: Verifica se tem foto
    if (!fileInput.files[0]) {
        alert("Ops! Selecione uma foto primeiro para o Stick. 📸");
        return;
    }

    // 2. Prepara o "pacote" de envio (FormData)
    const formData = new FormData();
    formData.append('foto', fileInput.files[0]);
    formData.append('legenda', captionInput.value);

    try {
        // 3. Envia para o seu servidor Node.js
        const resposta = await fetch('http://localhost:3000/postar', {
            method: 'POST',
            body: formData
        });

        if (resposta.ok) {
            const resultado = await resposta.json();
            alert("🚀 Sucesso: " + resultado.mensagem);
            fecharModal();
        } else {
            alert("Erro ao enviar para o servidor. 😕");
        }
    } catch (erro) {
        console.error("Erro na conexão:", erro);
        alert("O servidor está desligado! Ligue o Node no terminal. 🧠🔌");
    }
}