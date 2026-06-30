import React, { useState } from 'react';
import './Carrossel.styles.css';

export default function Carrossel({ imagens }) {
    const [indiceAtual, setIndiceAtual] = useState(0);
    const quantidade = imagens.length;

    // Se não houver imagens, não renderiza nada
    if (!Array.isArray(imagens) || quantidade <= 0) {
        return <p>Nenhuma imagem para exibir.</p>;
    }

    const proximaImagem = () => {
        // Se for a última imagem, volta para a primeira (índice 0)
        setIndiceAtual(indiceAtual === quantidade - 1 ? 0 : indiceAtual + 1);
    };

    const imagemAnterior = () => {
        // Se for a primeira imagem, vai para a última
        setIndiceAtual(indiceAtual === 0 ? quantidade - 1 : indiceAtual - 1);
    };

    return (
        <div className="carrossel-container">
            {/* Botão Esquerdo */}
            <button className="seta seta-esquerda" onClick={imagemAnterior}>
                &#10094;
            </button>

            {/* Imagens alteradas */}
            {imagens.map((imagem, index) => (
                <div
                    className={index === indiceAtual ? 'slide ativo' : 'slide'}
                    key={index}
                >
                    {/* Removeu a condição condicional daqui, deixando a imagem renderizar sempre */}
                    <img src={imagem} alt={`Slide ${index + 1}`} className="imagem-carrossel" />
                </div>
            ))}

            {/* Botão Direito */}
            <button className="seta seta-direita" onClick={proximaImagem}>
                &#10095;
            </button>

            {/* Indicadores (Pontinhos na parte inferior) */}
            <div className="indicadores">
                {imagens.map((_, index) => (
                    <span
                        key={index}
                        className={index === indiceAtual ? 'ponto ativo' : 'ponto'}
                        onClick={() => setIndiceAtual(index)}
                    />
                ))}
            </div>
        </div>
    );
};

