import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts.js";
import { ImageOff, PackageX } from "lucide-react";
import "../styles/Produtos.styles.css"

import { LoaderCircle } from "lucide-react"
import ProdutoSkeleton from "./ProdutosSkeleton.jsx";

export default function ListaProdutos() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useProducts(page);

if (isLoading) {
  return (
    <div className="produtos-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProdutoSkeleton key={index} />
      ))}
    </div>
  );
}

  const produtos = data?.data || [];
  const totalPaginas = data?.pagination?.totalPages || 1;

  return (
    <div className="secao-produtos">
      <h1>Produtos {isFetching && "..."}</h1>

      
      <div className="produtos-grid">
        {produtos.length === 0 ? (
          <div className="texto-nenhum">
            <PackageX />
          <p>Nenhum produto encontrado nesta página.</p>
          </div>
        ) : (
          produtos.map((product) => (
            <div key={product.id} className="produto-card">
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

              <h5>{product.nome}</h5>
              <p>{product.descricao}</p>
              <p className="preco">R$ {product.preco.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>

      
      <div className="paginacao-container">
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