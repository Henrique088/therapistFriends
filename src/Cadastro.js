import lobo from './img/lobo.png';
import cadeado from './cadeado.svg';
import styles from './App.module.css';
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';



function Cad() {
  return (
    <div className={styles.app}>

      <div className={styles.left}>
        <h1 className={styles.title}>Crie sua conta</h1>
        <div className={styles.login_campo}>

          <span>Nome</span>
          <input placeholder="Digite seu nome"></input>

          <span>Sobrenome</span>
          <input placeholder="Digite seu sobrenome"></input>

          <span>@ E-mail</span>
          <input placeholder="Digite seu E-mail"></input>

          <div className={styles.senha}>
            <img src={cadeado} width="12px" heigth="12px" alt='imagem de um lobo'></img>
            <span className="s">Senha</span>
          </div>

          <input placeholder="Digite sua senha"></input>

        </div>

        <div className={styles.botao}>
          <button className={styles.logar}>Criar conta</button>



          <button className={styles.logar_google}><FcGoogle />{'\u00A0'} Cadastre-se com o Google</button>


        </div>



      </div>

      <div className={styles.right}>

        <img src={lobo} width="80%" heigth="60%" className="lobo" alt='imagem de um lobo'></img>

        <span>Já possui cadastro? <Link to="/login">Logar</Link></span>

      </div>


    </div>


  );
}


export default Cad;