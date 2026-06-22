import { useState } from "react";
import { useProducts } from "../hooks/useProducts.js";
import { ImageOff } from "lucide-react"

export default function Home() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useProducts(page);

    if (isLoading) return <p>Carregando primeira página...</p>;


    const produtos = data?.data || [];
    const totalPaginas = data?.pagination?.totalPages || 1;

    return (
        <div>
            <h1>Produtos {isFetching && "..."}</h1>

            <div>
                {produtos.length === 0 ? (
                    <p>Nenhum produto encontrado nesta página.</p>
                ) : (
                    produtos.map((product) => (
                        <div key={product.id} >

                            {/* Renderização Condicional da Imagem */}
                            <div className="product-image-container">
                                {product.imagem_url ? (
                                    <img
                                        src={product.imagem_url}
                                        alt={product.nome}
                                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                                    />
                                ) : (
                                    <ImageOff size={48} color="#999" />
                                )}
                            </div>

                            <h3>{product.nome}</h3>
                            <p>{product.descricao}</p>
                            <p><strong>Preço:</strong> R$ {product.preco.toFixed(2)}</p>
                            <p><strong>Categoria:</strong> {product.categoria.nome}</p>
                        </div>
                    ))
                )}
            </div>

            <div>
                <button
                    disabled={page === 1}
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                >
                    Anterior
                </button>

                <span>
                    Página {page} de {totalPaginas}
                </span>

                <button
                    disabled={page >= totalPaginas}
                    onClick={() => setPage((old) => old + 1)}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}