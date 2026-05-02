import React, { useState } from 'react'

export const ForgotPasswordForm = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Fake loading
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
      
      <p className='text-sm text-gray-400 mb-2'>
        Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
      </p>

      <div className='flex flex-col gap-1'>
        <label className='text-xs text-secondary ml-1 font-medium'>Email</label>
        <input 
          type="email" 
          placeholder="Tu correo"
          disabled={isLoading}
          className='bg-transparent border border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500 disabled:opacity-50'
        />
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className='relative flex items-center justify-center bg-primary text-white font-bold p-3 rounded-xl mt-2 hover:bg-[#991f23] transition-all active:scale-[0.98] overflow-hidden disabled:opacity-80'
      >
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin-slow text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m8-8h-2M6 12H4m13.657-5.657l-1.414 1.414M7.757 17.657l-1.414 1.414m12.728 0l-1.414-1.414M7.757 6.343L6.343 4.929" />
          </svg>
        ) : (
          "Enviar Instrucciones"
        )}
      </button>

      <div className='flex flex-col items-center gap-4 mt-6'>
        <button 
          type="button" 
          onClick={() => onNavigate('login')}
          className='text-sm border border-white/20 rounded-xl p-3 w-full hover:bg-white/5 hover:border-primary hover:text-white transition-colors'
        >
          Volver a <span className='font-bold ml-1 text-primary'>Iniciar Sesión</span>
        </button>
      </div>
    </form>
  )
}

