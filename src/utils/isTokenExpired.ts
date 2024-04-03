import { jwtDecode } from 'jwt-decode';
import { parseCookies } from 'nookies';
// Função para verificar se o token JWT está expirado
export function isTokenExpired(): boolean {
  const cookies = parseCookies();
  const token = cookies['@nextauth.token'];

  if (!token) {
    // Se o token não estiver presente, considere-o expirado
    return true;
  }

  try {
    // Decodifique o token JWT para obter a data de expiração
    const decodedToken: { exp: number } = jwtDecode(token);

    // Obtenha o timestamp atual
    const currentTime = Math.floor(Date.now() / 1000);

    // Verifique se a data de expiração do token é maior que o timestamp atual
    return decodedToken.exp < currentTime;
  } catch (error) {
    // Em caso de erro na decodificação do token, considere-o expirado
    return true;
  }
}
