import { setupAPIClient } from "@/services/api";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const apiClient = setupAPIClient();

    const data = await apiClient.post("/user/forgot-password", {
      email,
    });

    setMessage(data.data.message);
    toast.success("Link para resetar senha enviado, olhe sem email.");
    setLoading(false)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Esqueci Minha Senha
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {loading ? (
                <FaSpinner
                  size={16}
                  className="animate-spin text-4xl text-white"
                />
              ) : (
                <>Enviar Email de Redefinição</>
              )}
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
}
