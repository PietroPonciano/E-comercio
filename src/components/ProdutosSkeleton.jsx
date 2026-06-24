import "../styles/ProdutoSkeleton.styles.css"

export default function ProdutoSkeleton({ className = '', ...props }) {
  return (
    <div 
      className={`produto-card-skeleton ${className}`.trim()} 
      role="status"
      aria-busy="true"
      {...props}
    >
      
      <div className="product-image-placeholder placeholder-shimmer"></div>

      
      <div className="product-info-skeleton">
        
        <div className="product-title-placeholder placeholder-shimmer"></div>
        
       
        <div className="product-text-placeholder placeholder-shimmer" style={{ width: '100%' }}></div>
        <div className="product-text-placeholder placeholder-shimmer" style={{ width: '75%' }}></div>

        <div className="product-price-placeholder placeholder-shimmer"></div>
      </div>

      <span className="sr-only">Carregando produto...</span>
    </div>
  );
}