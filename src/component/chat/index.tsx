import { useState, useEffect, FormEvent, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import styles from "./styles.module.scss"; // Importando o arquivo SCSS
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { setupAPIClient } from "@/services/api";
import { Plano, Usuario } from "@/model/type";
const notificationSound = "/public/sounds/notification.mp3"; // coloque o arquivo de som na pasta public/sounds

interface Message {
  id: string;
  consultorId: string | number;
  sender?: string;
  name: string;
  text: string;
}

interface Payload {
  name: string;
  sender?: string;
  consultorId: string | number;
  clienteId: string | number;
  text: string;
  targetUserId: string | number;
  targetRole: "cliente" | "consultor";
}

const socket = io("https://chat-api.contaplus.app.br", {
  withCredentials: true,
  transports: ["websocket"],
});

export default function Chat(type: { usuario: Usuario }) {
  const [title] = useState("Fale com os nossos consultores");
  const [name] = useState(type.usuario.nome || "Sem nome");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true); // Controle para abrir/fechar chat
  const [isMinimized, setIsMinimized] = useState(true); // Controle para minimizar/maximizar chat
  const [consultorId, setConsultorId] = useState<string | number>("");
  const [showNotification, setShowNotification] = useState(false);
  const [numberNotifications, setNumberNotifications] = useState(0);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.emit("register", {
      userId: type.usuario.id,
      role: "cliente",
      consultorId: "",
      clienteId: type.usuario.id.toString(),
      name: type.usuario.nome,
    });

    // Solicita consultores online
    socket.emit("getOnlineConsultores");

    socket.on("onlineConsultores", (consultores) => {
      if (consultores.length > 0) {
        // Escolha o primeiro consultor online ou implemente sua lógica de escolha
        console.log("Consultores online:", consultores[0].consultorId);
        setConsultorId(consultores[0].consultorId);
      } else {
        // Nenhum consultor online, usa o consultorId 1
        setConsultorId("1");
      }
    });

    socket.on("conversationHistory", (history) => {
      setMessages(history.map((msg) => ({ id: uuidv4(), ...msg })));
    });

    socket.on("msgToClient", (message: Payload) => {
      console.log(message);
      if (message) {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowNotification(true);
        setNumberNotifications((prev) => prev + 1);
        playNotificationSound();
      }
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), ...message, sender: message.sender },
      ]);
    });

    return () => {
      socket.off("onlineConsultores");
      socket.off("conversationHistory");
      socket.off("msgToClient");
    };
  }, [type.usuario.id]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio();

      // Ordem de tentativa: MP3, OGG, WAV
      const sources = [
        { type: "audio/mpeg", src: "/sounds/notification.mp3" },
        { type: "audio/ogg", src: "/sounds/notification.ogg" },
        { type: "audio/wav", src: "/sounds/notification.wav" },
      ].filter((source) => {
        // Verifica se o navegador suporta o tipo
        return audio.canPlayType(source.type) !== "";
      });

      if (sources.length === 0) {
        console.warn("Nenhum formato de áudio suportado pelo navegador");
        return;
      }

      // Tenta cada fonte até uma funcionar
      const tryPlay = (index = 0) => {
        if (index >= sources.length) return;

        audio.src = sources[index].src;
        audio.load();

        audio
          .play()
          .then(() => console.log("Áudio reproduzido com sucesso"))
          .catch((e) => {
            console.warn(`Falha ao reproduzir ${sources[index].src}`, e);
            tryPlay(index + 1); // Tenta o próximo formato
          });
      };

      tryPlay();
    } catch (error) {
      console.error("Erro ao carregar áudio:", error);
    }
  };
  const validateInput = () => text.trim().length > 0;
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (validateInput() && consultorId) {
      const message: Payload = {
        name: type.usuario.nome,
        text,
        consultorId,
        clienteId: type.usuario.id.toString(),
        targetUserId: consultorId.toString(),
        targetRole: "consultor",
      };

      socket.emit("msgToServer", message);
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), name: type.usuario.nome, text, consultorId },
      ]);
      setText("");
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setShowNotification(false);
    setNumberNotifications(0);
  };

  return (
    <div
      className={`${styles.chatwindow} ${isMinimized ? styles.minimized : ""} ${
        isChatOpen ? styles.chatwindowopen : styles.chatwindowhidden
      }`}
    >
      <div
        className={`${styles.chatbox} ${isMinimized ? styles.minimized : ""}`}
      >
        <div className={styles.header}>
          <h1 className={`${styles.title} ${isMinimized ? styles.small : ""}`}>
            {isMinimized ? "" : title}
          </h1>
          <button onClick={toggleMinimize} className={styles.minimizebtn}>
            {isMinimized ? (
              <div>
                <div>
                  {showNotification ? (
                    <div className="flex flex-col justify-between items-center">
                      {numberNotifications > 0 && (
                        <span className="bg-green-900 rounded-2xl py-1 px-2  text-white text-xs">{numberNotifications}</span>
                      )}

                      <IoChatbubbleEllipses size={50} />
                    </div>
                  ) : (
                    <IoChatbubbleEllipses size={50} />
                  )}
                </div>
              </div>
            ) : (
              <IoMdClose size={30} />
            )}
          </button>
        </div>
        {isMinimized ? null : (
          <>
            <div className={styles.messagetext}>
              <ul className={styles.messages}>
                {messages.map((message, idx) => {
                  const isCliente = message.name === type.usuario.nome;
                  return (
                    <li
                      key={message.id}
                      className={
                        isCliente
                          ? styles.clienteMessage
                          : styles.consultorMessage
                      }
                      ref={idx === messages.length - 1 ? lastMessageRef : null}
                    >
                      <div className={styles.messageBox}>
                        <span className={styles.messageAuthor}>
                          {message.name}
                        </span>
                        <p className={styles.messageText}>{message.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <form onSubmit={sendMessage} className={styles.boxSender}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite uma mensagem..."
                className={styles.inputmessage}
              />
              <button type="submit" className={styles.sendbtn}>
                <IoIosSend />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
