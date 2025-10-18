import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import lobo from '../../img/lobo.png';
import flor from '../../img/flor_02.png';
import leitura from '../../img/garota-de-vista-lateral-na-biblioteca.jpg';
import contato from '../../img/contato.jpg';
import agenda from '../../img/agenda.jpg';
import maos from '../../img/maos.webp';
import { FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaSquareInstagram } from "react-icons/fa6";

function Home() {
    const [showOptions, setShowOptions] = useState(false);
    const [activeCard, setActiveCard] = useState(null);

    const handleButtonClick = () => {
        setShowOptions(!showOptions);
    }

    const headClick = (e) => {
        if (window.location.pathname === "/") {
            window.location.reload();
        }
    }

    const handleCardClick = (cardIndex) => {
        if (activeCard === cardIndex) {
            setActiveCard(null);
        } else {
            setActiveCard(cardIndex);
        }
    }

    const handleCardMouseEnter = (cardIndex) => {
        setActiveCard(cardIndex);
    }

    const handleCardMouseLeave = () => {
        setActiveCard(null);
    }

    const cards = [
        {
            title: "Desabafe",
            description: "Usuários podem compartilhar suas preocupações, angústias e desafios de forma completamente anônima na nossa plataforma. Este espaço de desabafo é confidencial e protegido, garantindo que você possa expressar seus sentimentos sem medo de julgamento.",
            image: maos,
            paragrafo: "Desabafe Anonimamente"
        },
        {
            title: "Profissionais",
            description: "Terapeutas e psicólogos cadastrados na plataforma terão acesso às mensagens anônimas dos usuários. Eles podem ler e avaliar cada caso de acordo com sua especialização e experiência.",
            image: leitura,
            paragrafo: "Leitura Pelos Profissionais"
        },
        {
            title: "Contato",
            description: "Se um profissional se sentir apto a ajudar, ele pode iniciar um contato com o usuário através de mensagens dentro da plataforma. Durante essa interação, o usuário terá acesso ao perfil do profissional, incluindo suas qualificações, experiência e avaliações de outros pacientes, proporcionando credibilidade e confiança na conversa.",
            image: contato,
            paragrafo: "Contato Iniciado Pelos Profissionais"
        },
        {
            title: "Agendamento",
            description: "Caso o usuário e o profissional concordem, é possível marcar uma consulta, que pode ser realizada de forma online, conforme a preferência e disponibilidade de ambos.",
            image: agenda,
            paragrafo: "Agendamento de Atendimento"
        }
    ];

    return (
        <header className={styles.cabecalho}>
            <div className={styles.topo}>
                <div className={styles.head}>
                    <div className={styles.logoNome}>
                        <Link to="/ " className={styles.img_topo} onClick={headClick}>
                            <img src={lobo} width="55px" alt='imagem de um lobo' />
                            Therapist Friend
                        </Link>
                    </div>
                    <div className={styles.loginCad}>
                        <Link to="/login" className={styles.log}><a>Login</a></Link>
                        <Link to="/cadastro" className={styles.log}><a>Cadastro</a></Link>
                    </div>
                </div>
            </div>

            <div className={styles.conteudo}>
                <div className={styles.bemVindo}>
                    <img src={flor} className={styles.img} alt="flor decorativa"></img>
                    <span className={styles.texto}>
                        Bem-vindo(a) à Therapist Friend, um espaço dedicado a oferecer suporte emocional e psicológico para aqueles que mais necessitam. Nossa missão é reduzir as taxas de evasão e a falta de procura por atendimento psicológico, proporcionando um ambiente seguro e anônimo onde os usuários podem desabafar e encontrar o apoio necessário.
                    </span>
                </div>
            </div>
            <hr></hr>
            <span className={styles.comoFunciona}>Como funciona?</span>

            <div className={styles.f}>
                {cards.map((card, index) => (
                    <div 
                        key={index}
                        className={`${styles.card} ${activeCard === index ? styles.cardActive : ''}`}
                        onClick={() => handleCardClick(index)}
                        onMouseEnter={() => handleCardMouseEnter(index)}
                        onMouseLeave={handleCardMouseLeave}
                    >
                        <p className={styles.paragrafo}>{card.paragrafo}</p>
                        <div 
                            className={styles.card__content} 
                            style={{ 
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${card.image})` 
                            }}
                        >
                            <p className={styles.card__title}>{card.title}</p>
                            <p className={styles.card__description}>{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <footer>
                <p className={styles.criador}>Henrique Ribeiro da Silva Almeida</p>
                <div className={styles.contato}>
                    <p>Contatos:</p>
                    <a href="mailto:seuemail@dominio.com" target="_blank" rel="noopener noreferrer" aria-label="E-mail">
                        <SiGmail /> E-mail
                    </a>
                    <a href="https://www.linkedin.com/in/seu-linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedin /> Linkedin
                    </a>
                    <a href="https://www.instagram.com/seu-instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaSquareInstagram /> Instagram
                    </a>
                </div>
            </footer>
        </header>
    );
}

export default Home;