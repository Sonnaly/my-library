function abrirFichario(titulo, estrelas, notas, index) {
    livroAtualIndex = index;
    document.getElementById('modal-titulo').innerText = titulo
    document.getElementById('modal-estrelas').innerText = estrelas
    document.getElementById('modal-notas').innerText = notas
    document.getElementById('modalFichario').style.display = 'flex'
}

function fecharFichario() {
    document.getElementById('modalFichario').style.display = 'none';
}

function abrirFormulario() {
    document.getElementById('modalFormulario').style.display = 'flex';
}

function fecharFormulario() {
    document.getElementById('modalFormulario').style.display = 'none';
    limparFormulario();    
}

// 1. Criamos uma lista (Array) para guardar os livros na memória
let meusLivros = JSON.parse(localStorage.getItem('biblioteca')) || [];

// 2. Função para "Desenhar" os livros que estão salvos
function renderizarLivros() {
    const estante = document.querySelector('.estante');
    estante.innerHTML = "";

    meusLivros.forEach((livro, index) => {

        const novoLivro = document.createElement('div');
        novoLivro.className = 'livro-item';

        novoLivro.onclick = () => abrirFichario(livro.titulo, livro.estrelas, livro.notas, index);

        novoLivro.innerHTML = `
            <button class="btn-delete" onclick="event.stopPropagation(); deletarLivro(${index})">🗑</button>
            <img src="${livro.capa}" class="capa">
            <div class="estrelas-mini">${livro.estrelas}</div>
        `;
        estante.appendChild(novoLivro);
    });
}


let notaSelecionada = 5;

document.querySelectorAll(".star").forEach(star => {

    star.addEventListener("click", function(){

        notaSelecionada = Number(this.dataset.value);

        document.querySelectorAll(".star").forEach(s => s.classList.remove("active"));

        for(let i = 0; i < notaSelecionada; i++){
            document.querySelectorAll(".star")[i].classList.add("active");
        }

    });

}); 

let livroAtualIndex = null;
// 3. Função de adicionar livro
function adicionarLivro() {

    const titulo = document.getElementById('titulo-input').value;
    const notas = document.getElementById('notas-input').value;

    const estrelasTexto = "★".repeat(notaSelecionada) + "☆".repeat(5 - notaSelecionada);

    // SE FOR EDIÇÃO (livroAtualIndex não é nulo)
    if (livroAtualIndex !== null && meusLivros[livroAtualIndex]) {
        // Agora o código só entra aqui se o livro realmente existir no índice indicado
        const capaAntiga = meusLivros[livroAtualIndex].capa;
        salvarLivro(titulo, notas, estrelasTexto, capaAntiga);
        return; 
    }

    // SE FOR LIVRO NOVO
    const capaArquivo = document.getElementById('capa-input').files[0];

    if (capaArquivo) {

        const reader = new FileReader();

        reader.onload = function(event) {

            const capaBase64 = event.target.result;

            salvarLivro(titulo, notas, estrelasTexto, capaBase64);

        };

        reader.readAsDataURL(capaArquivo);

    } else {

        salvarLivro(titulo, notas, estrelasTexto, "https://via.placeholder.com/150x220");

    }

}

// 4. Função que salva o livro
function salvarLivro(titulo, notas, estrelas, capaFinal){

    const novoLivroObj = {
        titulo: titulo,
        notas: notas,
        capa: capaFinal,
        estrelas: estrelas
    };

    if(livroAtualIndex !== null && livroAtualIndex!== undefined){
    meusLivros[livroAtualIndex] = novoLivroObj;
    livroAtualIndex = null;
    }else{
        meusLivros.push(novoLivroObj);
    }

    localStorage.setItem('biblioteca', JSON.stringify(meusLivros));

    renderizarLivros();

    fecharFormulario();

    limparFormulario();
}

// 5. Executa a renderização quando a página carrega
window.onload = renderizarLivros;

function deletarLivro(index){

    if(confirm("Deseja remover este livro da estante?")){

        meusLivros.splice(index, 1);

        localStorage.setItem('biblioteca', JSON.stringify(meusLivros));

        renderizarLivros();
    }

}

function editarLivro(){

    const livro = meusLivros[livroAtualIndex];

    document.getElementById('titulo-input').value = livro.titulo;
    document.getElementById('notas-input').value = livro.notas;

    const quantidadeEstrelas = (livro.estrelas.match(/★/g) || []).length;

    notaSelecionada = quantidadeEstrelas;

    document.querySelectorAll(".star").forEach((star, i) => {
        star.classList.toggle("active", i < quantidadeEstrelas);
    });

    document.getElementById('capa-input').disabled = true;

    fecharFichario();
    abrirFormulario();

}

function limparFormulario() {
    // Pegamos os elementos
    const inputTitulo = document.getElementById('titulo-input');
    const inputNotas = document.getElementById('notas-input');
    const inputCapa = document.getElementById('capa-input');

    // Limpamos os valores (com a proteção de verificar se o elemento existe)
    if (inputTitulo) inputTitulo.value = "";
    if (inputNotas) inputNotas.value = "";
    
    if (inputCapa) {
        inputCapa.value = "";
        inputCapa.disabled = false; // Garante que o campo de arquivo volte a ser usável
    }

    // Reseta as estrelas visuais para o padrão (5 estrelas)
    notaSelecionada = 5;
    document.querySelectorAll(".star").forEach((s, i) => {
        s.classList.toggle("active", i < 5);
    });

    // Importante: garantir que o sistema saiba que não estamos mais editando
    livroAtualIndex = null;
}