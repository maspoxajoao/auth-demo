import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./Register.scss";

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    //Validação do Formato do E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(
        "O e-mail digitado não é válido. Certifique-se de usar um formato correto (ex: nome@dominio.com).",
      );
      setLoading(false);
      return;
    }

    // Validação Detalhada da Senha
    const passwordErrors: string[] = [];
    if (password.length < 8) passwordErrors.push("pelo menos 8 caracteres");
    if (!/[A-Z]/.test(password)) passwordErrors.push("uma letra maiúscula");
    if (!/[a-z]/.test(password)) passwordErrors.push("uma letra minúscula");
    if (!/\d/.test(password)) passwordErrors.push("um número");
    if (!/[@$!%*?&_\-]/.test(password))
      passwordErrors.push("um caractere especial (@, $, !, %, *, ?, &)");

    if (passwordErrors.length > 0) {
      setError(
        `A senha não é válida porque falta: ${passwordErrors.join(", ")}.`,
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (error) throw error;

      alert(
        "Cadastro realizado com sucesso! Você será redirecionado para o login.",
      );
      navigate("/");
    } catch (err: any) {
      // Tratamento de Erros do Supabase
      if (err.message === "User already registered") {
        setError(
          "Este endereço de e-mail já está sendo usado por outra conta.",
        );
      } else {
        setError(
          err.message || "Ocorreu um erro inesperado ao tentar criar a conta.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="title">Criar Conta</h2>
        <p className="subtitle">
          Cadastre-se para testar o sistema de autenticação
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="text"
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <p className="toggle-text">
          Já tem uma conta?{" "}
          <Link to="/" className="toggle-link">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};
