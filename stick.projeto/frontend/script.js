// --- ELEMENTOS DO DOM ---
const modal = document.getElementById('modalPost');
let imagemSelecionada = "";

// --- GERENCIAMENTO DO MODAL ---
function abrirModal() {
    if (modal) modal.style.display = 'flex';
}

function fecharModal() {
    if (modal) {
        modal.style.display = 'none';
        
        // Resetar campos do modal
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
        if (fileInput) fileInput.value = ""; 
        if (caption) caption.value = ""; 
        imagemSelecionada = ""; 
    }
}

window.onclick = function (event) {
    if (event.target == modal) fecharModal();
}

// --- PRÉVIA DA FOTO ---
function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();

    if (input.files && input.files[0]) {
        reader.onload = function (e) {
            const preview = document.getElementById('imagePreview');
            const text = document.getElementById('uploadText');
            const icon = document.querySelector('.upload-area i');

            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                imagemSelecionada = e.target.result; 
            }
            if (text) text.style.display = 'none';
            if (icon) icon.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// --- FUNÇÃO DE PUBLICAR (SOMENTE GRADE) ---
async function publicarPost() {
    const fileInput = document.getElementById('fileInput');
    const captionInput = document.getElementById('postCaption');
    const containerGrade = document.querySelector('.photo-grid');

    if (!imagemSelecionada) {
        alert("Ops! Selecione uma foto primeiro para o Stick. 📸");
        return;
    }

    // 1. Criar APENAS o item para a GRADE do perfil (Estilo Instagram)
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.innerHTML = `<img src="${imagemSelecionada}" alt="Post do Stick">`;

    // 2. Adicionar na tela apenas na GRADE
    if (containerGrade) {
        containerGrade.prepend(gridItem);
    }

    // 3. (Opcional) Tentar enviar para o servidor
    const formData = new FormData();
    formData.append('foto', fileInput.files[0]);
    formData.append('legenda', captionInput.value);

    try {
        await fetch('http://localhost:3000/postar', {
            method: 'POST',
            body: formData
        });
    } catch (erro) {
        console.log("Postado na grade localmente.");
    }

    fecharModal();
}

// --- CARREGAR CONTEÚDO AO INICIAR ---
async function carregarPosts() {
    try {
        const resposta = await fetch('http://localhost:3000/posts');
        if (resposta.ok) {
            const posts = await resposta.json();
            const containerGrade = document.querySelector('.photo-grid');
            if (containerGrade) {
                posts.forEach(post => {
                    const gridItem = document.createElement('div');
                    gridItem.className = 'grid-item';
                    gridItem.innerHTML = `<img src="${post.url}" alt="Post">`;
                    containerGrade.appendChild(gridItem);
                });
            }
        }
    } catch (erro) {
        console.warn("Modo offline: Mostrando apenas posts manuais.");
    }
}

window.onload = carregarPosts;