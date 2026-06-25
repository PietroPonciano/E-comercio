import { useState } from "react";


export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Qual é o prazo de entrega?",
            answer:
                "O prazo varia de acordo com sua localização e o método de envio escolhido."
        },
        {
            question: "Posso trocar ou devolver um produto?",
            answer:
                "Sim. Você pode solicitar a troca ou devolução dentro do prazo previsto em nossa política."
        },
        {
            question: "Quais formas de pagamento são aceitas?",
            answer:
                "Aceitamos PIX, boleto bancário e cartões de crédito das principais bandeiras."
        },
        {
            question: "Como acompanho meu pedido?",
            answer:
                "Após a confirmação da compra, você receberá o código de rastreamento por e-mail."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq">
            <h2>Perguntas Frequentes</h2>

            {faqs.map((faq, index) => (
                <div className="faq-item" key={index}>
                    <button
                        className="faq-question"
                        onClick={() => toggleFAQ(index)}
                    >
                        {faq.question}

                        <span
                            className={`faq-icon ${
                                openIndex === index ? "open" : ""
                            }`}
                        >
                            +
                        </span>
                    </button>

                    <div
                        className={`faq-answer ${
                            openIndex === index ? "open" : ""
                        }`}
                    >
                        <p>{faq.answer}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}