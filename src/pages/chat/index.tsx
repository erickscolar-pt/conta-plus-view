import { useState, useEffect, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import styles from "./styles.module.scss"; // Importando o arquivo SCSS
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { setupAPIClient } from "@/services/api";
import { Plano, Usuario } from "@/model/type";

interface Message {
  id: string;
  consultorId: string;
  sender?: string;
  name: string;
  text: string;
}

interface Payload {
  name: string;
  sender?: string;
  consultorId: string;
  clienteId: string;
  text: string;
  targetUserId: string,
  targetRole: 'cliente' | 'consultor'
}

const socket = io("http://localhost:3009", {
  withCredentials: true,
  transports: ["websocket"],
});

export default function Chat(type: { usuario: Usuario }) {
  const [title] = useState("Fale com os nossos consultores");
  const [name] = useState(type.usuario.nome);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true); // Controle para abrir/fechar chat
  const [isMinimized, setIsMinimized] = useState(true); // Controle para minimizar/maximizar chat
  const [consultorId, setConsultorId] = useState<string | null>("255");

  useEffect(() => {
    socket.emit("register", {
      userId: type.usuario.id,
      role: "cliente",
      consultorId,
      clienteId: type.usuario.id.toString(),
      name: type.usuario.nome,
    });
  
    socket.on("conversationHistory", (history) => {
      setMessages(history.map((msg) => ({ id: uuidv4(), ...msg })));
    });
  
    socket.on("msgToClient", (message: Payload) => {
      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), ...message, sender: message.sender },
      ]);
    });
  
    return () => {
      socket.off("conversationHistory");
      socket.off("msgToClient");
    };
  }, [type.usuario.id]);
  

  const validateInput = () => text.trim().length > 0;
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
  
    if (validateInput() && consultorId) {
      const message: Payload = {
        name: type.usuario.nome,
        text,
        consultorId,
        clienteId: type.usuario.id.toString(),
        targetUserId: "255",
        targetRole:'consultor'
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
              <IoChatbubbleEllipses size={60} />
            ) : (
              <IoMdClose size={30} />
            )}
          </button>
        </div>
        {isMinimized ? null : (
          <>
            <div className={styles.messagetext}>
              <ul className={styles.messages}>
                {messages.map((message) => {
                  const isCliente = message.name === name;
                  return (
                    <li
                      key={message.id}
                      className={
                        isCliente
                          ? styles.clienteMessage
                          : styles.consultorMessage
                      }
                    >
                      <div className={styles.messageBox}>
                        <span className={styles.messageAuthor}>
                          {message.name}
                        </span>
                        <p className={styles.messageText}>{message.text}</p>
                        {/* <span className={styles.messageTimestamp}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span> */}
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
