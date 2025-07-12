document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica do Catálogo ---
    const selCilindradas = document.getElementById('cilindradas');
    if (selCilindradas) { // Executa só se estiver na página do catálogo
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
                const catalogo = await response.json();
                iniciarFiltros(catalogo);
            } catch (error) {
                console.error("Erro ao carregar o arquivo catalogos.json:", error);
                if (resultadoDiv) {
                    resultadoDiv.innerHTML = `<p style="color: #ff6b6b;">Não foi possível carregar os catálogos.</p>`;
                }
            }
        }

        function iniciarFiltros(catalogo) {
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
            resetSelect(selCilindradas, 'Selecione a Cilindrada');
            categoriasPrincipais.forEach(categoria => {
                selCilindradas.innerHTML += `<option value="${categoria}">${categoria}</option>`;
            });

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

            selAno.addEventListener('change', function() {
                btnConsultar.disabled = !this.value;
                resultadoDiv.innerHTML = '';
            });

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