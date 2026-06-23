import React from "react";
import Carrossel from "../components/Carrossel.jsx";
import ListaProdutos from "../components/ListaProdutos.jsx";


export default function Home() {
  const minhasImagens = [
    'https://i0.wp.com/dkmidiadigital.com.br/wp-content/uploads/2023/03/OFERTAS-DA-SEMANA.png?fit=1920%2C1080&ssl=1',
    'https://blog.redelease.com.br/wp-content/uploads/2025/09/Red-Comic-Cartoon-Style-Sale-Discount-Instagram-Post-1920-x-1080-px.png',
    'https://clubeag.com/wp-content/uploads/2026/03/Banners-Clube-AG_20260302_174404_0000.jpg'
  ];

  return (
    <div className="pagina-home">
      
      <Carrossel imagens={minhasImagens} />
      
    
      <ListaProdutos />
    </div>
  );
}