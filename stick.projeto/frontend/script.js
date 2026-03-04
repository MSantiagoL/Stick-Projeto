/// --- ELEMENTOS DO DOM ---
const modal = document.getElementById('modalPost');
let imagemSelecionada = "";

// --- GERENCIAMENTO DO MODAL DE UPLOAD ---
function abrirModal() {
    if (modal) modal.style.display = 'flex';
}

function fecharModal() {
    if (modal) {
        modal.style.display = 'none';
        const preview = document.getElementById('imagePreview');
        const uploadText = document.getElementById('uploadText');
        const fileInput = document.getElementById('fileInput');
        const caption = document.getElementById('postCaption');
        const icon = document.querySelector('.upload-area i');

        if (preview) { preview.style.display = 'none'; preview.src = ""; }
        if (uploadText) uploadText.style.display = 'block';
        if (icon) icon.style.display = 'block';
        if (fileInput) fileInput.value = "";
        if (caption) caption.value = "";
        imagemSelecionada = "";
    }
}

window.onclick = function (event) {
    if (event.target == modal) fecharModal();
    if (event.target == document.getElementById('lightbox')) fecharLightbox();
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

// --- FUNÇÃO DE PUBLICAR ---
async function publicarPost() {
    const fileInput = document.getElementById('fileInput');
    const captionInput = document.getElementById('postCaption');
    
    if (!fileInput.files[0]) { // Verificação direta no input de arquivo
        alert("Ops! Selecione uma foto primeiro para o Stick. 📸");
        return;
    }

    const formData = new FormData();
    // Importante: 'foto' aqui deve ser IGUAL ao upload.single('foto') no server.js
    formData.append('foto', fileInput.files[0]);
    formData.append('legenda', captionInput.value);

    try {
        const resposta = await fetch('http://localhost:3000/postar', { 
            method: 'POST', 
            body: formData 
        });

        if (resposta.ok) {
            await carregarPosts(); 
            fecharModal();
        } else {
            const erroDados = await resposta.json();
            alert("Erro do servidor: " + (erroDados.erro || "Falha ao publicar"));
        }
    } catch (erro) {
        console.error("Erro na conexão:", erro);
        alert("Servidor offline! Verifique o terminal do VS Code.");
    }
}

// --- FUNÇÕES DO LIGHTBOX ---
function abrirLightbox(src, legenda) {
    const lightbox = document.getElementById('lightbox');
    const imgExpandida = document.getElementById('imgExpandida');
    const legendaExpandida = document.getElementById('legendaExpandida');

    if (lightbox && imgExpandida && legendaExpandida) {
        imgExpandida.src = src;
        legendaExpandida.innerText = (legenda && legenda !== "undefined" && legenda !== "null") ? legenda : "";
        lightbox.style.display = 'flex';
    }
}

function fecharLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = 'none';
}

// --- CARREGAR CONTEÚDO ---
async function carregarPosts() {
    try {
        const resposta = await fetch('http://localhost:3000/posts');
        if (resposta.ok) {
            const posts = await resposta.json();
            const containerGrade = document.querySelector('.photo-grid');
            
            if (containerGrade) {
                containerGrade.innerHTML = ""; 
                
                posts.forEach(post => {
                    const gridItem = document.createElement('div');
                    gridItem.className = 'grid-item';
                    
                    // Tratamento para evitar erros com aspas simples e quebras de linha
                    const legendaLimpa = post.legenda 
                        ? post.legenda.replace(/'/g, "\\'").replace(/\n/g, " ") 
                        : "";
                    
                    gridItem.innerHTML = `
                        <img src="${post.url}" 
                             alt="Post Stick" 
                             onclick="abrirLightbox('${post.url}', '${legendaLimpa}')">
                    `;
                    containerGrade.appendChild(gridItem);
                });
            }
        }
    } catch (erro) {
        console.warn("Servidor offline.");
    }
}

window.onload = carregarPosts;