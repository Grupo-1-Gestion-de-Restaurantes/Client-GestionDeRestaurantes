import React, { useState } from 'react'

export const RegisterForm = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Fake loading
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full'>
      
      <div className='flex gap-3 w-full'>
        <div className='flex flex-col gap-1 w-1/2'>
          <label className='text-xs text-secondary ml-1 font-medium'>Nombre</label>
          <input 
            type="text" 
            placeholder="John"
            disabled={isLoading}
            className='bg-transparent border border-white/20 rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50'
          />
        </div>
        <div className='flex flex-col gap-1 w-1/2'>
          <label className='text-xs text-secondary ml-1 font-medium'>Apellido</label>
          <input 
            type="text" 
            placeholder="Doe"
            disabled={isLoading}
            className='bg-transparent border border-white/20 rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50'
          />
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-xs text-secondary ml-1 font-medium'>Email</label>
        <input 
          type="email" 
          placeholder="Tu correo"
          disabled={isLoading}
          className='bg-transparent border border-white/20 rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-xs text-secondary ml-1 font-medium'>Password</label>
        <input 
          type="password" 
          placeholder="••••••••"
          disabled={isLoading}
          className='bg-transparent border border-white/20 rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50'
        />
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className='relative flex items-center justify-center bg-secondary text-background-base font-bold p-2.5 rounded-xl mt-1 hover:bg-[#d6ba00] transition-all active:scale-[0.98] overflow-hidden disabled:opacity-80'
      >
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin-slow text-background-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m8-8h-2M6 12H4m13.657-5.657l-1.414 1.414M7.757 17.657l-1.414 1.414m12.728 0l-1.414-1.414M7.757 6.343L6.343 4.929" />
          </svg>
        ) : (
          "Crear Cuenta"
        )}
      </button>

      <div className='flex flex-col items-center mt-3'>
        <button 
          type="button" 
          onClick={() => onNavigate('login')}
          className='text-sm text-gray-400 hover:text-white transition-colors w-full text-center p-1'
        >
          ¿Ya tienes cuenta? <span className='font-bold ml-1 text-secondary'>Inicia Sesión</span>
        </button>
      </div>
    </form>
  )
}


