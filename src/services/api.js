import axios from 'axios'

/**
 * Instância do axios configurada com a URL base da API.
 *
 * A baseURL lê a variável de ambiente VITE_API_URL (definida em .env).
 * Em desenvolvimento: http://localhost:8080
 * Em produção: https://financeiro-production-e0e0.up.railway.app
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

/**
 * Interceptor de REQUISIÇÃO: injeta o JWT no header Authorization.
 *
 * Por que localStorage?
 * É a abordagem mais simples para SPAs com JWT. O risco é que scripts
 * maliciosos (XSS) podem ler localStorage. A alternativa mais segura são
 * cookies httpOnly — que o browser não expõe para JavaScript — mas exige
 * mudanças no backend (set-cookie + CSRF protection).
 *
 * Mitigação atual: o React escapa saídas por padrão, reduzindo o risco de XSS.
 * Para produção crítica, considere migrar para httpOnly cookies.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

/**
 * Interceptor de RESPOSTA: limpa a sessão local em caso de 401 ou 403.
 *
 * 401 Unauthorized: token ausente, expirado ou inválido.
 * 403 Forbidden: token válido, mas sem permissão para o recurso.
 *
 * Em ambos os casos, remove o token do localStorage e redireciona para login.
 * Isso garante que o usuário não fique "preso" com um token inválido.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Extrai a mensagem de erro do backend, cobrindo os dois formatos hoje em uso:
 *   - string simples (AuthController, ex.: "Credenciais inválidas")
 *   - objeto { erro: "..." } (GastoController/SalarioController, via GlobalExceptionHandler)
 * Retorna o fallback se nenhum dos dois formatos for encontrado.
 */
export function extrairMensagemErro(error, fallback) {
  const dados = error.response?.data
  if (typeof dados === 'string' && dados) return dados
  if (dados && typeof dados === 'object' && typeof dados.erro === 'string') return dados.erro
  return fallback
}

export default api
