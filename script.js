document.addEventListener('DOMContentLoaded', function() {
    // --- CATÁLOGO COMPLETO E ATUALIZADO ---
    const catalogo = {
        '50cc': {},
        '90cc': {},
        '100cc': {
            'Biz 100': {
                '1998 - 2001': 'catalogos/biz100/1998 - 2001.pdf',
                '2002 - 2004': 'catalogos/biz100/2002 - 2004.pdf',
                '2005': 'catalogos/biz100/2005.pdf',
                '2013 - 2015': 'catalogos/biz100/2013 - 2015.pdf'
            },
            'C-100 Dream': {
                '1993 - 1998': 'catalogos/c100dream/1993 - 1998.pdf'
            },
            'Pop 100': {
                '2007 - 2015': 'catalogos/pop100/2007 - 2015.pdf'
            }
        },
        '110cc': {},
        '125cc': {
            'Biz 125': {
                '2006 - 2010': 'catalogos/biz125/2006 - 2010.pdf',
                '2011 - 2017': 'catalogos/biz125/2011 - 2017.pdf'
            }
        },
        '150cc': {
             'CG 150 Titan': {
                '2004 - 2008': 'catalogos/cg150/2004-2008.pdf'
             }
        },
        '160cc': {},
        '190cc': {},
        '250cc': {},
        '300cc': {},
        '400cc': {},
        '450cc': {},
        '500cc': {},
        '600cc': {},
        '650cc': {},
        '750cc': {},
        '1000cc': {},
        '1100cc': {},
        '1300cc': {},
        'Fourtrax': { // Nova categoria para Quadriciclos
            'Fourtrax 350': {
                // Adicione os intervalos de ano e PDFs aqui
                // Ex: '2010 - 2014': 'catalogos/fourtrax350/2010-2014.pdf'
            },
            'Fourtrax 420': {
                // Adicione os intervalos de ano e PDFs aqui
            }
        }
    };

    const selCilindradas = document.getElementById('cilindradas');
    const selModelo = document.getElementById('modelo');
    const selAno = document.getElementById('ano');
    const btnConsultar = document.getElementById('consultarBtn');
    const resultadoDiv = document.getElementById('resultado');

    // 1. Preencher seletor de CILINDRADAS/CATEGORIAS com ordenação
    const categoriasPrincipais = Object.keys(catalogo);

    // Ordenação customizada: números primeiro, depois texto
    categoriasPrincipais.sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        const aIsNum = !isNaN(numA);
        const bIsNum = !isNaN(numB);

        if (aIsNum && bIsNum) {
            return numA - numB; // Ordena números
        }
        if (aIsNum) return -1; // Números vêm antes de texto
        if (bIsNum) return 1;  // Texto vem depois de números
        return a.localeCompare(b); // Ordena textos
    });
    
    categoriasPrincipais.forEach(categoria => {
        selCilindradas.innerHTML += `<option value="${categoria}">${categoria}</option>`;
    });


    // 2. Evento de mudança no seletor de categorias
    selCilindradas.addEventListener('change', function() {
        const categoriaSelecionada = this.value;
        resetSelect(selModelo, 'Selecione');
        resetSelect(selAno, 'Selecione');
        selModelo.disabled = true;
        selAno.disabled = true;
        btnConsultar.disabled = true;
        resultadoDiv.innerHTML = '';

        if (categoriaSelecionada) {
            selModelo.disabled = false;
            for (const modelo in catalogo[categoriaSelecionada]) {
                selModelo.innerHTML += `<option value="${modelo}">${modelo}</option>`;
            }
        }
    });

    // 3. Evento de mudança no seletor de modelo
    selModelo.addEventListener('change', function() {
        const categoriaSelecionada = selCilindradas.value;
        const modeloSelecionado = this.value;
        
        resetSelect(selAno, 'Selecione');
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
                 // Se não houver anos definidos, mantém desabilitado
                 resetSelect(selAno, 'Nenhum catálogo');
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
    
    function resetSelect(selectElement, defaultText) {
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
    }
});