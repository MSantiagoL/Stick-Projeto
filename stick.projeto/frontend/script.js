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

// --- FUNÇÃO DE PRÉVIA DA FOTO (Ajustada para não falhar) ---
function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();

    // Verificamos se existe mesmo um arquivo selecionado
    if (input.files && input.files[0]) {
        reader.onload = function (e) {
            const output = document.getElementById('imagePreview');
            const text = document.getElementById('uploadText');
            const icon = document.querySelector('.upload-area i');

            if (output) {
                output.src = e.target.result;
                output.style.display = 'block'; // Mostra a imagem
            }
            if (text) text.style.display = 'none';    // Esconde o texto
            if (icon) icon.style.display = 'none';   // Esconde o ícone
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// --- FUNÇÃO DE PUBLICAR ---
function publicarPost() {
    const preview = document.getElementById('imagePreview');
    
    // Verifica se a imagem tem um conteúdo válido (não está vazia)
    if (!preview || !preview.src || preview.src.includes('window.location.origin') || preview.style.display === 'none') {
        alert("Ops! Selecione uma foto primeiro para o Stick. 📸");
        return;
    }

    alert("🚀 Show! Sua foto foi enviada para o Stick!");
    fecharModal();
}