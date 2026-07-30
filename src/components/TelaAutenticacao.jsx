import logoIcon from '../assets/logo-icon.png'
import linhaAscendente from '../assets/login-linha-ascendente.png'
import texturaGuilhoche from '../assets/textura-guilhoche.jpg'

/**
 * Estrutura compartilhada de Login/Cadastro: UM card grande e emoldurado
 * (cantos arredondados, sombra, margem visível do fundo ao redor) contendo
 * os dois lados — ilustração e formulário — lado a lado. Não são dois blocos
 * soltos indo até a borda do navegador.
 */
export default function TelaAutenticacao({ titulo, subtitulo, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 p-4 lg:p-10">
      <div className="w-full max-w-5xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Lado da ilustração */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-800 flex-col justify-between p-10">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `url(${texturaGuilhoche})`, backgroundSize: '220px', backgroundRepeat: 'repeat' }}
            aria-hidden="true"
          />
          <img
            src={linhaAscendente}
            alt=""
            className="absolute bottom-0 right-0 w-[78%] h-auto opacity-70 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, #102544 0%, #102544 38%, transparent 72%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center gap-2.5">
            <img src={logoIcon} alt="" className="w-8 h-8 object-contain" />
            <span className="text-white font-black text-xs uppercase tracking-wider leading-tight">
              Meu Controle<br />
              <span className="text-accent-400">Financeiro</span>
            </span>
          </div>

          <div className="relative z-10 text-white max-w-sm">
            <h1 className="text-2xl xl:text-3xl font-black leading-tight mb-3">{titulo}</h1>
            <p className="text-primary-200 text-sm xl:text-base">{subtitulo}</p>
          </div>
        </div>

        {/* Lado do formulário */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-14">
          <div className="w-full max-w-sm space-y-6">
            <div className="lg:hidden flex items-center gap-2.5 mb-2">
              <img src={logoIcon} alt="" className="w-8 h-8 object-contain" />
              <span className="text-text-primary font-black text-xs uppercase tracking-wider leading-tight">
                Meu Controle<br />
                <span className="text-accent-600">Financeiro</span>
              </span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
