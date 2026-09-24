(() => {
    const el = {
        modelo: document.getElementById("modelo"),
        ano: document.getElementById("ano"),
        codigoModelo: document.getElementById("codigoModelo"),

        indice: document.getElementById("indiceCatalogo"),
        grade: document.getElementById("gradeFiguras"),

        visualizador: document.getElementById("visualizadorCatalogo"),
        voltarIndice: document.getElementById("voltarIndice"),

        select: document.getElementById("figuras"),
        anterior: document.getElementById("anterior"),
        proxima: document.getElementById("proxima"),

        titulo: document.getElementById("tituloFigura"),
        contador: document.getElementById("contadorPecas"),
        imagem: document.getElementById("diagrama"),
        tbody: document.getElementById("listaPecas"),

        mais: document.getElementById("mais"),
        menos: document.getElementById("menos"),
        reset: document.getElementById("resetZoom"),
        zoomValor: document.getElementById("zoomValor"),

        erro: document.getElementById("erro")
    };

    let dados = null;
    let indiceAtual = 0;
    let zoom = 1;
    let baseCatalogo = "";
    let panX = 0;
    let panY = 0;
    let ehHonda = false;

    function nomeFigura(fig) {
        if (ehHonda) {
            return String(fig?.nome || fig?.numero || "").trim();
        }

        return `${fig?.numero ?? ""} ${fig?.nome ?? ""}`.trim();
    }

    function esc(valor) {
        return String(valor ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function diretorioDoArquivo(caminho) {
        const semQuery = String(caminho).split("?")[0].split("#")[0];
        const pos = semQuery.lastIndexOf("/");
        return pos >= 0 ? semQuery.slice(0, pos + 1) : "";
    }

    function resolverImagem(caminhoImagem) {
        const img = String(caminhoImagem || "");

        if (
            img.startsWith("http://") ||
            img.startsWith("https://") ||
            img.startsWith("/") ||
            img.startsWith("data:")
        ) {
            return img;
        }

        return baseCatalogo + img;
    }

    function aplicarPosicaoImagem() {
        el.imagem.style.transform =
            `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;
    }

    function resetarPosicaoImagem() {
        panX = 0;
        panY = 0;
        aplicarPosicaoImagem();
    }

    function aplicarZoom() {
        const canvas = document.getElementById("canvasImagem");

        // Em 100% a imagem aparece inteira, na proporção original.
        // O zoom usa transform para não alterar o tamanho-base do quadro
        // e não criar borda branca artificial.
        el.zoomValor.textContent = `${Math.round(zoom * 100)}%`;

        if (!canvas) {
            return;
        }

        canvas.classList.toggle("zoom-arrastavel", zoom > 1);

        if (zoom <= 1) {
            resetarPosicaoImagem();
        } else {
            aplicarPosicaoImagem();
        }
    }

    function mostrarIndice() {
        el.visualizador.hidden = true;
        el.indice.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function abrirFigura(novoIndice) {
        if (!dados?.figuras?.length) {
            return;
        }

        indiceAtual = Math.max(
            0,
            Math.min(novoIndice, dados.figuras.length - 1)
        );

        const fig = dados.figuras[indiceAtual];

        el.select.value = String(indiceAtual);

        const nomeExibido = nomeFigura(fig);

        el.titulo.textContent = nomeExibido;
        el.contador.textContent = `${fig.pecas?.length || 0} peças`;

        el.imagem.src = resolverImagem(fig.imagem);
        el.imagem.alt = nomeExibido;

        let pecas = Array.isArray(fig.pecas) ? [...fig.pecas] : [];

        // No catálogo Honda a referência vem como texto.
        // Sem ordenação natural, "10" fica logo depois de "1".
        // Ordenamos SOMENTE a Honda por referência numérica/natural.
        if (ehHonda) {
            const ordenadorRef = new Intl.Collator("pt-BR", {
                numeric: true,
                sensitivity: "base"
            });

            pecas.sort((a, b) =>
                ordenadorRef.compare(
                    String(a?.ref ?? ""),
                    String(b?.ref ?? "")
                )
            );
        }

        el.tbody.innerHTML = pecas.map(peca => {
            if (ehHonda) {
                return `
                    <tr>
                        <td>${esc(peca.ref)}</td>
                        <td>${esc(peca.codigo)}</td>
                        <td>${esc(peca.descricao)}</td>
                    </tr>
                `;
            }

            return `
                <tr>
                    <td>${esc(peca.ref)}</td>
                    <td>${esc(peca.codigo)}</td>
                    <td>${esc(peca.descricao)}</td>
                    <td>${esc(peca.quantidade)}</td>
                </tr>
            `;
        }).join("");

        el.anterior.disabled = indiceAtual === 0;
        el.proxima.disabled = indiceAtual === dados.figuras.length - 1;

        zoom = 1;
        resetarPosicaoImagem();
        aplicarZoom();

        const tabela = document.querySelector(".tabela-wrap");
        const imagem = document.getElementById("canvasImagem");

        if (tabela) {
            tabela.scrollTop = 0;
        }

        if (imagem) {
            imagem.scrollTop = 0;
            imagem.scrollLeft = 0;
        }

        el.indice.hidden = true;
        el.visualizador.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function renderizarIndice() {
        const figuras = Array.isArray(dados.figuras) ? dados.figuras : [];

        el.grade.innerHTML = figuras.map((fig, i) => {
            const nomeExibido = nomeFigura(fig);

            return `
                <button class="card-figura" type="button" data-indice="${i}">
                    <div class="card-figura-imagem">
                        <img
                            src="${esc(resolverImagem(fig.imagem))}"
                            alt="${esc(nomeExibido)}"
                            loading="lazy">
                    </div>

                    <div class="card-figura-rodape">
                        <div class="card-figura-titulo">
                            ${esc(nomeExibido)}
                        </div>

                        <div class="card-figura-seta" aria-hidden="true">→</div>
                    </div>
                </button>
            `;
        }).join("");

        el.grade.querySelectorAll(".card-figura").forEach(card => {
            card.addEventListener("click", () => {
                abrirFigura(Number(card.dataset.indice));
            });
        });
    }

    function mostrarErro(mensagem) {
        el.erro.hidden = false;
        el.erro.textContent = mensagem;
        el.modelo.textContent = "Erro ao carregar catálogo";
    }

    async function iniciar() {
        const params = new URLSearchParams(window.location.search);
        const caminhoCatalogo = params.get("catalogo");

        if (!caminhoCatalogo) {
            throw new Error(
                'Parâmetro "catalogo" não informado na URL.'
            );
        }

        baseCatalogo = diretorioDoArquivo(caminhoCatalogo);

        const resp = await fetch(caminhoCatalogo, {
            cache: "no-store"
        });

        if (!resp.ok) {
            throw new Error(
                `Não foi possível abrir ${caminhoCatalogo} (HTTP ${resp.status}).`
            );
        }

        dados = await resp.json();

        ehHonda = String(dados.marca || "")
            .trim()
            .toLowerCase() === "honda";

        document.body.classList.toggle("catalogo-honda", ehHonda);

        el.modelo.textContent =
            `${dados.modelo || ""}${dados.apelido ? " — " + dados.apelido : ""}`;

        el.ano.textContent = dados.ano || "";
        el.codigoModelo.textContent = dados.codigoModelo || "";

        const figuras = Array.isArray(dados.figuras) ? dados.figuras : [];

        if (!figuras.length) {
            throw new Error("O catálogo não possui figuras.");
        }

        document.title =
            `${dados.modelo || dados.marca || "Catálogo"} ${dados.ano || ""} - Catálogo de Peças`;

        el.select.innerHTML = figuras.map((fig, i) => (
            `<option value="${i}">${esc(nomeFigura(fig))}</option>`
        )).join("");

        renderizarIndice();

        el.select.addEventListener("change", () => {
            abrirFigura(Number(el.select.value));
        });

        el.anterior.addEventListener("click", () => {
            abrirFigura(indiceAtual - 1);
        });

        el.proxima.addEventListener("click", () => {
            abrirFigura(indiceAtual + 1);
        });

        el.voltarIndice.addEventListener("click", mostrarIndice);

        el.mais.addEventListener("click", () => {
            zoom = Math.min(2.5, zoom + 0.15);
            aplicarZoom();
        });

        el.menos.addEventListener("click", () => {
            zoom = Math.max(0.4, zoom - 0.15);
            aplicarZoom();
        });

        el.reset.addEventListener("click", () => {
            zoom = 1;
            resetarPosicaoImagem();
            aplicarZoom();
        });


        // =====================================================
        // ZOOM POR CLIQUE + ARRASTE LIVRE
        //
        // Clique em 100%  -> 200%
        // Clique em 200%  -> 100% (reset)
        // Em 200%, segure o botão esquerdo e arraste livremente.
        //
        // O clique é detectado no POINTERUP, e não pelo evento "click".
        // Assim o mousedown usado no arraste não bloqueia o reset.
        // =====================================================
        let pressionandoImagem = false;
        let arrastouImagem = false;
        let podeArrastar = false;

        let inicioX = 0;
        let inicioY = 0;
        let panInicialX = 0;
        let panInicialY = 0;

        const LIMITE_ARRASTE = 4;
        const canvasImagem = document.getElementById("canvasImagem");

        canvasImagem.addEventListener("pointerdown", (evento) => {
            // Só botão esquerdo e somente quando começou em cima da imagem.
            if (evento.button !== 0 || evento.target !== el.imagem) {
                return;
            }

            pressionandoImagem = true;
            arrastouImagem = false;
            podeArrastar = zoom > 1;

            inicioX = evento.clientX;
            inicioY = evento.clientY;

            panInicialX = panX;
            panInicialY = panY;

            if (podeArrastar) {
                canvasImagem.classList.add("arrastando");
            }

            // Captura o ponteiro para continuar recebendo o movimento
            // mesmo se o mouse sair da imagem durante o arraste.
            try {
                canvasImagem.setPointerCapture(evento.pointerId);
            } catch (_) {}

            // Evita o arraste nativo da imagem.
            evento.preventDefault();
        });

        canvasImagem.addEventListener("pointermove", (evento) => {
            if (!pressionandoImagem || !podeArrastar) {
                return;
            }

            const deltaX = evento.clientX - inicioX;
            const deltaY = evento.clientY - inicioY;

            if (
                Math.abs(deltaX) >= LIMITE_ARRASTE ||
                Math.abs(deltaY) >= LIMITE_ARRASTE
            ) {
                arrastouImagem = true;
            }

            if (!arrastouImagem) {
                return;
            }

            // Movimento livre nos dois eixos.
            panX = panInicialX + deltaX;
            panY = panInicialY + deltaY;

            aplicarPosicaoImagem();
        });

        canvasImagem.addEventListener("pointerup", (evento) => {
            if (!pressionandoImagem) {
                return;
            }

            const foiClique = !arrastouImagem;

            pressionandoImagem = false;
            podeArrastar = false;

            canvasImagem.classList.remove("arrastando");

            try {
                if (canvasImagem.hasPointerCapture(evento.pointerId)) {
                    canvasImagem.releasePointerCapture(evento.pointerId);
                }
            } catch (_) {}

            // Se não houve arraste, alterna o zoom.
            if (foiClique) {
                if (zoom <= 1) {
                    zoom = 2;
                } else {
                    zoom = 1;
                }

                resetarPosicaoImagem();
                aplicarZoom();
            }

            arrastouImagem = false;
            evento.preventDefault();
        });

        canvasImagem.addEventListener("pointercancel", (evento) => {
            pressionandoImagem = false;
            arrastouImagem = false;
            podeArrastar = false;

            canvasImagem.classList.remove("arrastando");

            try {
                if (canvasImagem.hasPointerCapture(evento.pointerId)) {
                    canvasImagem.releasePointerCapture(evento.pointerId);
                }
            } catch (_) {}
        });

        window.addEventListener("blur", () => {
            pressionandoImagem = false;
            arrastouImagem = false;
            podeArrastar = false;
            canvasImagem.classList.remove("arrastando");
        });

        mostrarIndice();
    }

    iniciar().catch(error => {
        console.error(error);
        mostrarErro(error.message || String(error));
    });
})();
