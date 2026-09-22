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
    let lupa = null;

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

    function criarLupa() {
        const canvas = document.getElementById("canvasImagem");

        if (!canvas || lupa) {
            return;
        }

        lupa = document.createElement("div");
        lupa.className = "lupa-imagem";
        canvas.appendChild(lupa);

        canvas.addEventListener("mousemove", atualizarLupa);
        canvas.addEventListener("mouseleave", esconderLupa);
        canvas.addEventListener("scroll", esconderLupa);

        window.addEventListener("resize", esconderLupa);
    }

    function esconderLupa() {
        if (!lupa) {
            return;
        }

        lupa.style.display = "none";

        const canvas = document.getElementById("canvasImagem");

        if (canvas) {
            canvas.classList.remove("lupa-ativa");
        }
    }

    function atualizarLupa(evento) {
        if (
            !lupa ||
            !el.imagem ||
            !el.imagem.src ||
            window.matchMedia("(max-width: 900px)").matches
        ) {
            esconderLupa();
            return;
        }

        const canvas = document.getElementById("canvasImagem");

        if (!canvas) {
            return;
        }

        const rectImg = el.imagem.getBoundingClientRect();

        const mx = evento.clientX;
        const my = evento.clientY;

        if (
            mx < rectImg.left ||
            mx > rectImg.right ||
            my < rectImg.top ||
            my > rectImg.bottom
        ) {
            esconderLupa();
            return;
        }

        const xNaImagem = mx - rectImg.left;
        const yNaImagem = my - rectImg.top;

        const percentualX = xNaImagem / rectImg.width;
        const percentualY = yNaImagem / rectImg.height;

        const tamanho = 280;
        const ampliacao = 1.8;

        const rectCanvas = canvas.getBoundingClientRect();

        let left =
            mx -
            rectCanvas.left +
            canvas.scrollLeft -
            (tamanho / 2);

        let top =
            my -
            rectCanvas.top +
            canvas.scrollTop -
            (tamanho / 2);

        const minLeft = canvas.scrollLeft;
        const minTop = canvas.scrollTop;

        const maxLeft =
            canvas.scrollLeft +
            canvas.clientWidth -
            tamanho;

        const maxTop =
            canvas.scrollTop +
            canvas.clientHeight -
            tamanho;

        left = Math.max(minLeft, Math.min(left, maxLeft));
        top = Math.max(minTop, Math.min(top, maxTop));

        lupa.style.left = `${left}px`;
        lupa.style.top = `${top}px`;
        lupa.style.display = "block";

        canvas.classList.add("lupa-ativa");

        const bgWidth = rectImg.width * ampliacao;
        const bgHeight = rectImg.height * ampliacao;

        lupa.style.backgroundImage = `url("${el.imagem.src}")`;
        lupa.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;

        const bgX =
            (percentualX * bgWidth) -
            (tamanho / 2);

        const bgY =
            (percentualY * bgHeight) -
            (tamanho / 2);

        lupa.style.backgroundPosition =
            `-${bgX}px -${bgY}px`;
    }

    function aplicarZoom() {
        el.imagem.style.width = `${zoom * 100}%`;
        el.zoomValor.textContent = `${Math.round(zoom * 100)}%`;
        esconderLupa();
    }

    function mostrarIndice() {
        esconderLupa();

        el.visualizador.hidden = true;
        el.indice.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function abrirFigura(novoIndice) {
        esconderLupa();

        if (!dados?.figuras?.length) {
            return;
        }

        indiceAtual = Math.max(
            0,
            Math.min(novoIndice, dados.figuras.length - 1)
        );

        const fig = dados.figuras[indiceAtual];

        el.select.value = String(indiceAtual);
        el.titulo.textContent = `${fig.numero} ${fig.nome}`;
        el.contador.textContent = `${fig.pecas?.length || 0} peças`;

        el.imagem.src = resolverImagem(fig.imagem);
        el.imagem.alt = `${fig.numero} ${fig.nome}`;

        const pecas = Array.isArray(fig.pecas) ? fig.pecas : [];

        el.tbody.innerHTML = pecas.map(peca => `
            <tr>
                <td>${esc(peca.ref)}</td>
                <td>${esc(peca.codigo)}</td>
                <td>${esc(peca.descricao)}</td>
                <td>${esc(peca.quantidade)}</td>
            </tr>
        `).join("");

        el.anterior.disabled = indiceAtual === 0;
        el.proxima.disabled = indiceAtual === dados.figuras.length - 1;

        zoom = 1;
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

        el.grade.innerHTML = figuras.map((fig, i) => `
            <button class="card-figura" type="button" data-indice="${i}">
                <div class="card-figura-imagem">
                    <img
                        src="${esc(resolverImagem(fig.imagem))}"
                        alt="${esc(fig.numero)} ${esc(fig.nome)}"
                        loading="lazy">
                </div>

                <div class="card-figura-rodape">
                    <div class="card-figura-titulo">
                        ${esc(fig.numero)} ${esc(fig.nome)}
                    </div>

                    <div class="card-figura-seta" aria-hidden="true">→</div>
                </div>
            </button>
        `).join("");

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

        el.modelo.textContent =
            `${dados.modelo || ""}${dados.apelido ? " — " + dados.apelido : ""}`;

        el.ano.textContent = dados.ano || "";
        el.codigoModelo.textContent = dados.codigoModelo || "";

        const figuras = Array.isArray(dados.figuras) ? dados.figuras : [];

        if (!figuras.length) {
            throw new Error("O catálogo não possui figuras.");
        }

        document.title =
            `${dados.modelo || "Yamaha"} ${dados.ano || ""} - Catálogo de Peças`;

        el.select.innerHTML = figuras.map((fig, i) => (
            `<option value="${i}">${esc(fig.numero)} ${esc(fig.nome)}</option>`
        )).join("");

        renderizarIndice();
        criarLupa();

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
            aplicarZoom();
        });

        mostrarIndice();
    }

    iniciar().catch(error => {
        console.error(error);
        mostrarErro(error.message || String(error));
    });
})();
