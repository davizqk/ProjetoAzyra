import { useEffect, useState } from "react";

export default function EditarPerfil({
  usuario,
  foto,
  aoCancelar,
  aoSalvar,
}) {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [novaFoto, setNovaFoto] = useState(foto || "");

  useEffect(() => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setNovaFoto(foto || "");
  }, [usuario, foto]);

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setNovaFoto(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  function enviarFormulario(event) {
    event.preventDefault();

    if (!nome.trim() || !email.trim()) {
      alert("Preencha o nome e o e-mail.");
      return;
    }

    aoSalvar({
      nome: nome.trim(),
      email: email.trim(),
      foto: novaFoto,
    });
  }

  return (
    <main style={estilos.pagina}>
      <section style={estilos.card}>
        <h1 style={estilos.titulo}>Editar perfil</h1>

        <form onSubmit={enviarFormulario}>
          <div style={estilos.fotoContainer}>
            {novaFoto ? (
              <img
                src={novaFoto}
                alt="Prévia da foto do perfil"
                style={estilos.foto}
              />
            ) : (
              <div style={estilos.avatarVazio}>
                {nome.trim().charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <label style={estilos.labelFoto}>
              Escolher foto
              <input
                type="file"
                accept="image/*"
                onChange={selecionarFoto}
                style={estilos.inputArquivo}
              />
            </label>
          </div>

          <label style={estilos.label} htmlFor="nome">
            Nome completo
          </label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Digite seu nome"
            style={estilos.input}
            required
          />

          <label style={estilos.label} htmlFor="email">
            E-mail
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Digite seu e-mail"
            style={estilos.input}
            required
          />

          <div style={estilos.botoes}>
            <button
              type="button"
              onClick={aoCancelar}
              style={estilos.botaoCancelar}
            >
              Cancelar
            </button>

            <button type="submit" style={estilos.botaoSalvar}>
              Salvar alterações
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const estilos = {
  pagina: {
    minHeight: "100vh",
    padding: "30px 18px",
    boxSizing: "border-box",
    background: "#f5f6fa",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    maxWidth: "550px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "14px",
    background: "#ffffff",
    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
  },

  titulo: {
    marginTop: 0,
    marginBottom: "28px",
    color: "#252525",
  },

  fotoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    marginBottom: "28px",
  },

  foto: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  avatarVazio: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "#e2e7ff",
    color: "#3549a5",
    fontSize: "32px",
    fontWeight: "bold",
  },

  labelFoto: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#e9ecff",
    color: "#3549a5",
    cursor: "pointer",
  },

  inputArquivo: {
    display: "none",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#333333",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    boxSizing: "border-box",
    border: "1px solid #d5d5d5",
    borderRadius: "8px",
    fontSize: "15px",
  },

  botoes: {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "10px",
  },

  botaoCancelar: {
    padding: "12px 18px",
    border: "1px solid #d5d5d5",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#333333",
    cursor: "pointer",
  },

  botaoSalvar: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#3549a5",
    color: "#ffffff",
    cursor: "pointer",
  },
};