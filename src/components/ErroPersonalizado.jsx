import { CircleAlert } from "lucide-react"

export default function ErroPersonalizado({value}){
    return(
        <>
        <div className="erro-carregamento">
            <CircleAlert className="icone-erro-carregamento" size={30}/>
            <p>Não foi possivel carregar {value}. Tente Novamente!</p>
        </div>
        </>
    )
}