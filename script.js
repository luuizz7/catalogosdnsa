document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica do Catálogo ---
    const selMarca = document.getElementById('marca');
    const selCilindradas = document.getElementById('cilindradas');

    if (selMarca && selCilindradas) { // Executa só se estiver na página do catálogo
        const selModelo = document.getElementById('modelo');
        const selAno = document.getElementById('ano');
        const btnConsultar = document.getElementById('consultarBtn');
        const resultadoDiv = document.getElementById('resultado');

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

            const marcas = Object.keys(catalogo).sort((a, b) => a.localeCompare(b));

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
                    selModelo.disabled = false;

                    const modelosOrdenados = Object.keys(catalogo[marcaSelecionada][cilindradaSelecionada])
                        .sort((a, b) => a.localeCompare(b));

                    modelosOrdenados.forEach(modelo => {
                        selModelo.innerHTML += `<option value="${modelo}">${modelo}</option>`;
                    });
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