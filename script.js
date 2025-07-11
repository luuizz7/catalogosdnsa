// Adiciona um ouvinte de eventos que espera todo o HTML da página ser carregado para então executar o código.
document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona os elementos do HTML com os quais vamos interagir.
    const selCilindradas = document.getElementById('cilindradas');
    const selModelo = document.getElementById('modelo');
    const selAno = document.getElementById('ano');
    const btnConsultar = document.getElementById('consultarBtn');
    const resultadoDiv = document.getElementById('resultado');

    // Esta função assíncrona busca os dados do arquivo `catalogos.json`.
    async function carregarCatalogo() {
        try {
            const response = await fetch('catalogos.json'); // Busca o arquivo JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const catalogo = await response.json(); // Converte a resposta em um objeto JavaScript

            // chamamos a função que inicia a lógica dos filtros.
            iniciarFiltros(catalogo);

        } catch (error) {
            console.error("Erro ao carregar o arquivo catalogos.json:", error);
            resultadoDiv.innerHTML = `<p style="color: #ff6b6b;">Não foi possível carregar os catálogos. Verifique o console para mais detalhes.</p>`;
        }
    }

    // Função que contém toda a lógica dos filtros.
    function iniciarFiltros(catalogo) {
        
        // 1. Preencher seletor de CILINDRADAS
        const categoriasPrincipais = Object.keys(catalogo);

        categoriasPrincipais.sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            const aIsNum = !isNaN(numA);
            const bIsNum = !isNaN(numB);

            if (aIsNum && bIsNum) return numA - numB;
            if (aIsNum) return -1;
            if (bIsNum) return 1;
            return a.localeCompare(b);
        });
        
        // Limpa o select antes de adicionar novas opções
        resetSelect(selCilindradas, 'Selecione a Cilindrada');
        categoriasPrincipais.forEach(categoria => {
            selCilindradas.innerHTML += `<option value="${categoria}">${categoria}</option>`;
        });

        // 2. Evento de mudança no seletor de categorias
        selCilindradas.addEventListener('change', function() {
            const categoriaSelecionada = this.value;
            resetSelect(selModelo, 'Selecione o Modelo');
            resetSelect(selAno, 'Selecione o Ano');
            selModelo.disabled = true;
            selAno.disabled = true;
            btnConsultar.disabled = true;
            resultadoDiv.innerHTML = '';

            if (categoriaSelecionada) {
                selModelo.disabled = false;
                const modelosOrdenados = Object.keys(catalogo[categoriaSelecionada]).sort((a, b) => a.localeCompare(b));
                modelosOrdenados.forEach(modelo => {
                    selModelo.innerHTML += `<option value="${modelo}">${modelo}</option>`;
                });
            }
        });

        // 3. Evento de mudança no seletor de modelo
        selModelo.addEventListener('change', function() {
            const categoriaSelecionada = selCilindradas.value;
            const modeloSelecionado = this.value;
            
            resetSelect(selAno, 'Selecione o Ano');
            selAno.disabled = true;
            btnConsultar.disabled = true;
            resultadoDiv.innerHTML = '';

            if (modeloSelecionado) {
                const anosDisponiveis = catalogo[categoriaSelecionada][modeloSelecionado];
                const intervalosOrdenados = Object.keys(anosDisponiveis).sort();
                
                if (intervalosOrdenados.length > 0) {
                    selAno.disabled = false;
                    intervalosOrdenados.forEach(intervaloDeAno => {
                        selAno.innerHTML += `<option value="${intervaloDeAno}">${intervaloDeAno}</option>`;
                    });
                } else {
                    resetSelect(selAno, 'Nenhum catálogo disponível');
                }
            }
        });

        // 4. Evento de mudança no seletor de ano
        selAno.addEventListener('change', function() {
            btnConsultar.disabled = !this.value;
            resultadoDiv.innerHTML = '';
        });

        // 5. Ação do botão de consulta
        btnConsultar.addEventListener('click', function() {
            const categoria = selCilindradas.value;
            const modelo = selModelo.value;
            const intervaloAno = selAno.value;
            const caminhoPdf = catalogo[categoria][modelo][intervaloAno];

            const catalogoHtml = `
                <h3>Catálogo para ${modelo} (${intervaloAno})</h3>
                <ul class="catalogo-lista">
                    <li>
                        <a href="${caminhoPdf}" target="_blank">
                            <span class="pdf-icon"></span>
                            Visualizar Catálogo de Peças (${intervaloAno})
                        </a>
                    </li>
                </ul>`;

            resultadoDiv.innerHTML = catalogoHtml;
        });
    }
    
    function resetSelect(selectElement, defaultText) {
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
    }

    carregarCatalogo();
});