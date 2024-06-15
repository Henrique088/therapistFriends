import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from'./nav.module.css';
import lobo from './lobo.png';
import flor from './flor_02.png';
import { LoremIpsum, Avatar } from 'react-lorem-ipsum';
import img_card from './3918491.jpg';


function Ini(){
    const[showOptions, setShowOptions] = useState(false);

    const handleButtonClick = () =>{
        setShowOptions(!showOptions);
    }
    return(

        <header className={styles.cabecalho}>
            <div className={styles.topo}>
            <div className={styles.logoNome}>
                <img src={lobo} width="10%" height="10%"></img>
                <span>Therapist Friend</span>
            </div>

            <div className={styles.loginCad}>
                <Link to="/login" className={styles.log}><a>Login</a></Link>
            
                <div className={styles.navButton}>
                    <button onClick={handleButtonClick} className={styles.botao}>Novo?</button>
                    {showOptions && (
                        <div className={styles.options}>
                            <Link to="/cadastro">Paciente</Link>
                            <Link to="/cadastro"> Profissional</Link>
                        </div>

                    )}
                </div>
            </div>
            <hr></hr>
            </div>


            <div className={styles.conteudo}>
                <div className={styles.bemVindo}>
                    <img src={flor} width="20%"></img>
                    <span className={styles.texto}>
                    Bem-vindo(a) à Therapist Friend, um espaço dedicado a oferecer suporte emocional e psicológico para aqueles que mais necessitam. Nossa missão é reduzir as taxas de evasão e a falta de procura por atendimento psicológico, proporcionando um ambiente seguro e anônimo onde os usuários podem desabafar e encontrar o apoio necessário.


                    </span>
                </div>
            </div>        
                <span className={styles.comoFunciona}>Como funciona?</span>
                
                <div className={styles.cards}>
                    
                    <div className={styles.a}>
                        <img src={img_card} width="25%" ></img>
                        <span className={styles.b}>1. Desabafe Anonimamente: Usuários podem compartilhar suas preocupações, angústias e desafios de forma completamente anônima na nossa plataforma. Este espaço de desabafo é confidencial e protegido, garantindo que você possa expressar seus sentimentos sem medo de julgamento.</span>
                    </div>

                    <div className={styles.a}>
                        <img src={img_card} width="25%"></img>
                        <span className={styles.b}>2. Leitura pelos Profissionais: Terapeutas e psicólogos cadastrados na plataforma terão acesso às mensagens anônimas dos usuários. Eles podem ler e avaliar cada caso de acordo com sua especialização e experiência.</span>
                    </div>


                    <div className={styles.a}>
                        <img src={img_card} width="25%" ></img>
                        <span className={styles.b}>3. Contato Iniciado pelos Profissionais: Se um profissional se sentir apto a ajudar, ele pode iniciar um contato com o usuário através de mensagens dentro da plataforma. Durante essa interação, o usuário terá acesso ao perfil do profissional, incluindo suas qualificações, experiência e avaliações de outros pacientes, proporcionando credibilidade e confiança na conversa.</span>
                    </div>

                    <div className={styles.a}>
                        <img src={img_card} width="25%" ></img>
                        <span className={styles.b}>4. Agendamento de Atendimento: Caso o usuário e o profissional concordem, é possível marcar uma consulta, que pode ser realizada online ou presencialmente, conforme a preferência e disponibilidade de ambos.</span>
                    </div>
                    
                    
                    
                </div>

            
        </header>
        


    );
}

export default Ini;