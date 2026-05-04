import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { showSuccess, showError } from '../../../shared/utils/toast';

export const RegisterForm = ({ onSwitch }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const registerUser = useAuthStore(state => state.register);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Si quisieras enviar la imagen, aquí usarías un FormData
    // Por ahora enviamos los datos del form como la lógica solicita
    const res = await registerUser(data);
    if (res.success) {
      showSuccess("¡Cuenta creada exitosamente!");
      onSwitch('login');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className='flex flex-col gap-3 w-full max-h-[55vh] sm:max-h-[65vh] overflow-y-auto pr-1 overflow-x-hidden pb-2' 
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
    >
      
      <div className='flex gap-3 w-full'>
        <div className='flex flex-col gap-1 flex-1'>
          <label className='text-xs text-secondary ml-1 font-medium'>Nombre</label>
          <input 
            type="text" 
            placeholder="John"
            disabled={loading}
            {...register("name", { required: "El nombre es obligatorio" })}
            className={`bg-transparent border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white w-full box-border`}
          />
          {errors.name && <span className="text-red-500 text-xs ml-1">{errors.name.message}</span>}
        </div>
        <div className='flex flex-col gap-1 flex-1'>
          <label className='text-xs text-secondary ml-1 font-medium'>Apellido</label>
          <input 
            type="text" 
            placeholder="Doe"
            disabled={loading}
            {...register("surname", { required: "El apellido es obligatorio" })}
            className={`bg-transparent border ${errors.surname ? 'border-red-500' : 'border-white/20'} rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white w-full box-border`}
          />
          {errors.surname && <span className="text-red-500 text-xs ml-1">{errors.surname.message}</span>}
        </div>
      </div>

      <div className='flex gap-3 w-full'>
        <div className='flex flex-col gap-1 flex-1'>
          <label className='text-xs text-secondary ml-1 font-medium'>Usuario</label>
          <input 
            type="text" 
            placeholder="johndoe123"
            disabled={loading}
            {...register("username", { required: "El usuario es obligatorio" })}
            className={`bg-transparent border ${errors.username ? 'border-red-500' : 'border-white/20'} rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white w-full box-border`}
          />
          {errors.username && <span className="text-red-500 text-xs ml-1">{errors.username.message}</span>}
        </div>
        <div className='flex flex-col gap-1 flex-1'>
          <label className='text-xs text-secondary ml-1 font-medium'>Teléfono</label>
          <input 
            type="tel" 
            placeholder="00000000"
            disabled={loading}
            {...register("phone", { required: "El teléfono es obligatorio" }, { pattern: { value: /^\d{8}$/, message: "El teléfono debe tener 8 dígitos" } })}
            className={`bg-transparent border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white w-full box-border`}
          />
          {errors.phone && <span className="text-red-500 text-xs ml-1">{errors.phone.message}</span>}
        </div>
      </div>

      <div className='flex flex-col gap-1 w-full'>
        <label className='text-xs text-secondary ml-1 font-medium'>Email</label>
        <input 
          type="email" 
          placeholder="Tu correo"
          disabled={loading}
          {...register("email", { required: "El correo es obligatorio", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo inválido" } })}
          className={`bg-transparent border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white w-full box-border`}
        />
        {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email.message}</span>}
      </div>

      <div className='flex flex-col gap-1 w-full'>
        <label className='text-xs text-secondary ml-1 font-medium'>Contraseña</label>
        <input 
          type="password" 
          placeholder="••••••••"
          disabled={loading}
          {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
          className={`bg-transparent border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white w-full box-border`}
        />
        {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
      </div>

      <div className='flex flex-col gap-1 w-full'>
        <label className='text-xs text-secondary ml-1 font-medium'>Foto de perfil (Opcional)</label>
        <div className='flex items-center gap-3 mt-1'>
          <div 
            className='h-12 w-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden shrink-0'
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className='flex-1'>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              disabled={loading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-transparent border border-white/20 rounded-xl p-2.5 text-sm w-full text-center text-gray-400 hover:text-white hover:border-secondary transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Subir imagen
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center mt-1">{error}</div>}

      <button 
        type="submit"
        disabled={loading}
        className='relative flex items-center justify-center bg-secondary text-background-base font-bold p-2.5 rounded-xl mt-1 hover:bg-[#d6ba00] transition-all active:scale-[0.98] overflow-hidden disabled:opacity-80 shrink-0'
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin-slow text-background-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m8-8h-2M6 12H4m13.657-5.657l-1.414 1.414M7.757 17.657l-1.414 1.414m12.728 0l-1.414-1.414M7.757 6.343L6.343 4.929" />
          </svg>
        ) : (
          "Crear Cuenta"
        )}
      </button>

      <div className='flex flex-col items-center mt-2 shrink-0'>
        <button 
          type="button" 
          onClick={() => onSwitch('login')}
          className='text-sm text-gray-400 hover:text-white transition-colors w-full text-center p-1'
        >
          ¿Ya tienes cuenta? <span className='font-bold ml-1 text-secondary'>Inicia Sesión</span>
        </button>
      </div>
    </form>
  )
}


