document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica do Catálogo ---
    const selMarca = document.getElementById('marca');
    const selCilindradas = document.getElementById('cilindradas');

    if (selMarca && selCilindradas) { // Executa só se estiver na página do catálogo
        const selModelo = document.getElementById('modelo');
        const selAno = document.getElementById('ano');
        const btnConsultar = document.getElementById('consultarBtn');
        const resultadoDiv = document.getElementById('resultado');
        const modelInfo = document.getElementById('modelInfo');
        const modelInfoBtn = document.getElementById('modelInfoBtn');
        const modelInfoTitle = document.getElementById('modelInfoTitle');
        const modelInfoContent = document.getElementById('modelInfoContent');

        const gruposInformacoes = [
            {
                id: 'crosser',
                titulo: 'Diferenças entre as Crosser 150',
                identificar(modelo) {
                    const nome = String(modelo || '').trim().toUpperCase();

                    if (!nome.startsWith('CROSSER 150')) return null;

                    if (/^CROSSER\s+150\s+ED\b/.test(nome)) return 'ED';
                    if (/^CROSSER\s+150\s+E\b/.test(nome)) return 'E';
                    if (/^CROSSER\s+150\s+S\b/.test(nome)) return 'S';
                    if (/^CROSSER\s+150\s+Z\b/.test(nome)) return 'Z';

                    return null;
                },
                itens: [
                    {
                        id: 'E',
                        nome: 'Crosser 150 E',
                        descricao: 'Partida Elétrica / Freio Dianteiro Tambor / Freio Traseiro Tambor'
                    },
                    {
                        id: 'ED',
                        nome: 'Crosser 150 ED',
                        descricao: 'Partida Elétrica / Freio Dianteiro Disco / Freio Traseiro Tambor'
                    },
                    {
                        id: 'S',
                        nome: 'Crosser 150 S',
                        descricao: 'Paralama Pequeno / Até 2018 Tambor Traseiro / 2019+ Disco Traseiro e ABS Dianteiro'
                    },
                    {
                        id: 'Z',
                        nome: 'Crosser 150 Z',
                        descricao: 'Paralama Grande / Protetor de Bengala / Até 2018 Tambor Traseiro / 2019+ Disco Traseiro e ABS Dianteiro'
                    }
                ]
            },
            {
                id: 'factor150',
                titulo: 'Diferenças entre as Factor 150',
                identificar(modelo) {
                    const nome = String(modelo || '').trim().toUpperCase();

                    if (!nome.startsWith('FACTOR 150')) return null;

                    if (/^FACTOR\s+150\s+ED\b/.test(nome)) return 'ED';
                    if (/^FACTOR\s+150\s+E\b/.test(nome)) return 'E';

                    return null;
                },
                itens: [
                    {
                        id: 'E',
                        nome: 'Factor 150 E',
                        descricao: 'Roda Raiada / Freio a Tambor'
                    },
                    {
                        id: 'ED',
                        nome: 'Factor 150 ED',
                        descricao: 'Roda Liga / Freio a Disco'
                    }
                ]
            },
            {
                id: 'fazer150',
                titulo: 'Diferenças entre as Fazer 150',
                identificar(modelo) {
                    const nome = String(modelo || '').trim().toUpperCase();

                    if (!nome.startsWith('FAZER 150')) return null;

                    if (/^FAZER\s+150\s+SED\b/.test(nome)) return 'SED';
                    if (/^FAZER\s+150\s+ED\b/.test(nome)) return 'ED';

                    return null;
                },
                itens: [
                    {
                        id: 'ED',
                        nome: 'Fazer 150 ED',
                        descricao: 'Sem Cavalete Central/Pisca Laranja'
                    },
                    {
                        id: 'SED',
                        nome: 'Fazer 150 SED',
                        descricao: 'Com Cavalete Central/Pisca Transparente'
                    }
                ]
            }
        ];

        function encontrarGrupoInformacoes(modelo) {
            for (const grupo of gruposInformacoes) {
                const versao = grupo.identificar(modelo);

                if (versao) {
                    return { grupo, versao };
                }
            }

            return null;
        }

        function renderizarGrupoInfo(grupo, versaoSelecionada = null) {
            return `
                <div class="model-info-group">
                    <div class="model-info-group-title">${grupo.titulo}</div>
                    ${grupo.itens.map(item => `
                        <div class="crosser-info-item ${item.id === versaoSelecionada ? 'selecionado' : ''}">
                            <strong>${item.nome}</strong>
                            <span>${item.descricao}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function atualizarInfoModelo(modelo = '') {
            if (!modelInfo || !modelInfoContent || !modelInfoTitle) return;

            const marcaSelecionada = String(selMarca?.value || '').trim().toUpperCase();
            const cilindradaSelecionada = String(selCilindradas?.value || '').trim();
            const ehYamaha150 = marcaSelecionada === 'YAMAHA' && cilindradaSelecionada === '150';

            const encontrado = encontrarGrupoInformacoes(modelo);

            // O botão já aparece ao selecionar Yamaha + 150.
            // Se um dos modelos configurados estiver selecionado, destaca a versão correspondente.
            const mostrar = ehYamaha150 || Boolean(encontrado);

            modelInfo.hidden = !mostrar;
            modelInfo.classList.remove('aberto');

            if (modelInfoBtn) {
                modelInfoBtn.setAttribute('aria-expanded', 'false');
            }

            if (!mostrar) {
                modelInfoContent.innerHTML = '';
                return;
            }

            if (encontrado) {
                const { grupo, versao } = encontrado;
                modelInfoTitle.textContent = grupo.titulo;
                modelInfoContent.innerHTML = renderizarGrupoInfo(grupo, versao);
                return;
            }

            // Yamaha 150 selecionada, mas ainda sem modelo:
            // mostra todas as diferenças disponíveis.
            modelInfoTitle.textContent = 'Informações dos modelos Yamaha 150';

            modelInfoContent.innerHTML = gruposInformacoes
                .map(grupo => renderizarGrupoInfo(grupo))
                .join('');
        }

        if (modelInfoBtn && modelInfo) {
            modelInfoBtn.addEventListener('click', function(event) {
                event.stopPropagation();

                const abriu = modelInfo.classList.toggle('aberto');
                modelInfoBtn.setAttribute('aria-expanded', String(abriu));
            });

            document.addEventListener('click', function(event) {
                if (!modelInfo.contains(event.target)) {
                    modelInfo.classList.remove('aberto');
                    modelInfoBtn.setAttribute('aria-expanded', 'false');
                }
            });

            modelInfo.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    modelInfo.classList.remove('aberto');
                    modelInfoBtn.setAttribute('aria-expanded', 'false');
                    modelInfoBtn.focus();
                }
            });
        }

        async function carregarCatalogo() {
            try {
                const response = await fetch('catalogos.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const catalogoOriginal = await response.json();

                // Seu catalogos.json atual começa direto pelas cilindradas.
                // Então o sistema coloca tudo dentro da marca Honda automaticamente.
                const catalogo = organizarCatalogoPorMarca(catalogoOriginal);

                iniciarFiltros(catalogo);

            } catch (error) {
                console.error("Erro ao carregar o arquivo catalogos.json:", error);

                if (resultadoDiv) {
                    resultadoDiv.innerHTML = `<p style="color: #ff6b6b;">Não foi possível carregar os catálogos.</p>`;
                }
            }
        }

        function organizarCatalogoPorMarca(catalogoOriginal) {
            const marcasConhecidas = [
                'Honda',
                'Yamaha',
                'Suzuki',
                'Kawasaki',
                'Dafra',
                'Shineray',
                'Triumph',
                'BMW',
                'KTM',
                'Haojue'
            ];

            const chavesPrincipais = Object.keys(catalogoOriginal);

            const jaEstaSeparadoPorMarca = chavesPrincipais.some(chave => {
                return marcasConhecidas.includes(chave);
            });

            if (jaEstaSeparadoPorMarca) {
                return catalogoOriginal;
            }

            return {
                "Honda": catalogoOriginal
            };
        }

        function iniciarFiltros(catalogo) {
            resetSelect(selMarca, 'Selecione a Marca');
            resetSelect(selCilindradas, 'Selecione a Cilindrada');
            resetSelect(selModelo, 'Selecione o Modelo');
            resetSelect(selAno, 'Selecione o Ano');

            selCilindradas.disabled = true;
            selModelo.disabled = true;
            selAno.disabled = true;
            btnConsultar.disabled = true;
            resultadoDiv.innerHTML = '';
            atualizarInfoModelo('');

            const ordemMarcas = [
                'Honda',
                'Yamaha',
                'Suzuki',
                'Shineray',
                'Sundown',
                'Tvs',
                'Dafra',
                'Haojue',
                'Kasinski'
            ];

            const marcas = Object.keys(catalogo).sort((a, b) => {
                const posA = ordemMarcas.indexOf(a);
                const posB = ordemMarcas.indexOf(b);

                if (posA !== -1 && posB !== -1) return posA - posB;
                if (posA !== -1) return -1;
                if (posB !== -1) return 1;

                return a.localeCompare(b);
            });

            marcas.forEach(marca => {
                selMarca.innerHTML += `<option value="${marca}">${marca}</option>`;
            });

            selMarca.addEventListener('change', function() {
                const marcaSelecionada = this.value;

                resetSelect(selCilindradas, 'Selecione a Cilindrada');
                resetSelect(selModelo, 'Selecione o Modelo');
                resetSelect(selAno, 'Selecione o Ano');

                selCilindradas.disabled = true;
                selModelo.disabled = true;
                selAno.disabled = true;
                btnConsultar.disabled = true;
                resultadoDiv.innerHTML = '';
                atualizarInfoModelo('');

                if (marcaSelecionada) {
                    selCilindradas.disabled = false;

                    const cilindradas = Object.keys(catalogo[marcaSelecionada]);

                    cilindradas.sort((a, b) => {
                        const numA = parseInt(a);
                        const numB = parseInt(b);

                        const aIsNum = !isNaN(numA);
                        const bIsNum = !isNaN(numB);

                        if (aIsNum && bIsNum) return numA - numB;
                        if (aIsNum) return -1;
                        if (bIsNum) return 1;

                        return a.localeCompare(b);
                    });

                    cilindradas.forEach(cilindrada => {
                        selCilindradas.innerHTML += `<option value="${cilindrada}">${cilindrada}</option>`;
                    });
                }
            });

            selCilindradas.addEventListener('change', function() {
                const marcaSelecionada = selMarca.value;
                const cilindradaSelecionada = this.value;

                resetSelect(selModelo, 'Selecione o Modelo');
                resetSelect(selAno, 'Selecione o Ano');

                selModelo.disabled = true;
                selAno.disabled = true;
                btnConsultar.disabled = true;
                resultadoDiv.innerHTML = '';

                if (marcaSelecionada && cilindradaSelecionada) {
                    atualizarInfoModelo('');

                    selModelo.disabled = false;

                    const modelosOrdenados = Object.keys(catalogo[marcaSelecionada][cilindradaSelecionada])
                        .sort((a, b) => a.localeCompare(b));

                    modelosOrdenados.forEach(modelo => {
                        selModelo.innerHTML += `<option value="${modelo}">${modelo}</option>`;
                    });
                } else {
                    atualizarInfoModelo('');
                }
            });

            selModelo.addEventListener('change', function() {
                const marcaSelecionada = selMarca.value;
                const cilindradaSelecionada = selCilindradas.value;
                const modeloSelecionado = this.value;

                resetSelect(selAno, 'Selecione o Ano');

                selAno.disabled = true;
                btnConsultar.disabled = true;
                resultadoDiv.innerHTML = '';

                atualizarInfoModelo(modeloSelecionado);

                if (marcaSelecionada && cilindradaSelecionada && modeloSelecionado) {
                    const anosDisponiveis = catalogo[marcaSelecionada][cilindradaSelecionada][modeloSelecionado];
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

            selAno.addEventListener('change', function() {
                btnConsultar.disabled = !this.value;
                resultadoDiv.innerHTML = '';
            });

            btnConsultar.addEventListener('click', function() {
                const marca = selMarca.value;
                const cilindrada = selCilindradas.value;
                const modelo = selModelo.value;
                const intervaloAno = selAno.value;

                const caminhoPdf = catalogo[marca][cilindrada][modelo][intervaloAno];

                const catalogoHtml = `
                    <h3>Catálogo para ${modelo} (${intervaloAno})</h3>
                    <ul class="catalogo-lista">
                        <li>
                            <a href="${caminhoPdf}" target="_blank">
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
    }

    // --- Lógica do Carrossel de Imagens ---
    const carousel = document.querySelector('.carousel-container');

    if (carousel) { // Executa só se estiver na página Sobre Nós
        const slide = carousel.querySelector('.carousel-slide');
        const images = carousel.querySelectorAll('.carousel-slide img');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');

        let currentIndex = 0;
        const totalImages = images.length;

        function goToSlide(index) {
            if (index < 0) {
                currentIndex = totalImages - 1;
            } else if (index >= totalImages) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            slide.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function showNextImage() {
            goToSlide(currentIndex + 1);
        }

        function showPrevImage() {
            goToSlide(currentIndex - 1);
        }

        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);

        setInterval(showNextImage, 5000);
    }
});