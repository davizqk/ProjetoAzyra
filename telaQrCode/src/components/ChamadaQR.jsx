import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import logo from "../assets/logo-qrcode.png";
import "./ChamadaQR.css";

function gerarToken() {
  return (
    Math.random().toString(36).substring(2) +
    Date.now().toString(36)
  );
}

export default function ChamadaQR() {
  const [token, setToken] = useState(() => gerarToken());
  const [tempo, setTempo] = useState(300);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempo((atual) => {
        if (atual <= 1) {
          setToken(gerarToken());
          return 300;
        }

        return atual - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const minutos = Math.floor(tempo / 60);
  const segundos = String(tempo % 60).padStart(2, "0");

  const conteudoQR = "http://172.16.1.177:5173/";

  return (
    <main className="chamada-container">
      <img
        src={logo}
        alt="Logo Azyra"
        className="chamada-logo"
      />

      <h1>Registre seu atraso!</h1>

      <div className="chamada-quadrado">
        <QRCodeSVG
          value={conteudoQR}
          size={250}
          level="H"
          includeMargin={true}
        />
      </div>

      <p className="chamada-instrucao">
        Aponte a câmera para o QR Code
      </p>
    </main>
  );
}