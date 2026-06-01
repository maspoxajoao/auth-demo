import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabaseClient";
import "./Dashboard.scss";

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const userMetadata = user?.user_metadata;
  const userName = userMetadata?.full_name || user?.email?.split("@")[0];
  const userAvatar =
    userMetadata?.avatar_url || "https://via.placeholder.com/150";

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <div className="logo">
          AuthFlow <span>Insights</span>
        </div>
        {user && (
          <div className="user-profile">
            <img src={userAvatar} alt="Avatar" className="avatar" />
            <div className="user-info">
              <span className="name">Olá, {userName}!</span>
              <span className="email">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        )}
      </header>

      <main className="dash-content">
        <article className="post-article">
          <span className="badge">Acesso Concedido via JWT</span>
          <h1>
            Você está dentro! Mas o que acabou de acontecer nos bastidores?
          </h1>

          <p className="intro">
            Se você chegou até essa tela, significa que o sistema validou a sua
            identidade com sucesso. Como eu mencionei no meu post, a minha maior
            curiosidade era entender como tudo isso funcionava na prática. Olha
            só o que aconteceu entre o seu clique e o carregamento desta página:
          </p>
          <hr />

          <section className="topic">
            <h2>1. A ponte com o Google (OAuth2)</h2>
            <p>
              Quando você clicou em "Continuar com o Google", a aplicação não
              tentou adivinhar sua senha. Na verdade, ela te levou até os
              servidores seguros do Google. Depois que você autorizou, o Google
              mandou um "ok" para o nosso banco de dados (Supabase), confirmando
              quem você é.
            </p>
          </section>

          <section className="topic">
            <h2>2. O seu crachá digital (O famoso JWT)</h2>
            <p>
              Com a confirmação feita, o sistema gerou um token chamado{" "}
              <strong>JWT (JSON Web Token)</strong>. Pense nele como um crachá
              digital criptografado que agora está guardado aí no seu navegador.
              A grande vantagem é que o servidor não precisa ficar gastando
              memória lembrando de você o tempo todo.
            </p>
          </section>

          <section className="topic">
            <h2>3. A proteção desta página</h2>
            <p>
              Você não consegue acessar essa Dashboard simplesmente colando o
              link no navegador. Toda vez que alguém tenta entrar aqui, o código
              verifica se o "crachá" (JWT) está presente e se ainda é válido. Se
              não estiver, o sistema bloqueia e manda o usuário de volta para a
              tela inicial!
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};
