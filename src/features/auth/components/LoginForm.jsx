import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../../shared/utils/toast';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const LoginForm = ({ onSwitch }) => {

  const navigate = useNavigate();

  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data)
    if (res.success) {
      navigate("/dashboard")
      toast.success("¡Bienvenido de nuevo!", { duration: 4000 })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full'>
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-secondary ml-1 font-medium'>Email o usuario</label>
        <input
          type="text"
          placeholder="Tu email o nombre de usuario"
          disabled={loading}
          {...register("emailOrUsername", { required: "El correo o usuario es obligatorio" })}
          className={`bg-transparent border ${errors.emailOrUsername ? 'border-red-500' : 'border-white/20'} rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500 disabled:opacity-50`}
        />
        {errors.emailOrUsername && <span className="text-red-500 text-xs ml-1">{errors.emailOrUsername.message}</span>}
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-xs text-secondary ml-1 font-medium'>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          disabled={loading}
          {...register("password", { required: "La contraseña es obligatoria" })}
          className={`bg-transparent border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500 disabled:opacity-50`}
        />
        {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
        <div className="flex justify-end w-full mt-1">
          <button
            type="button"
            onClick={() => onSwitch('forgot')}
            className="text-xs text-primary hover:text-secondary transition-colors duration-300"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className='relative flex items-center justify-center bg-primary text-white font-bold p-3 rounded-xl mt-2 hover:bg-[#991f23] transition-all active:scale-[0.98] overflow-hidden disabled:opacity-80'
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin-slow text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m8-8h-2M6 12H4m13.657-5.657l-1.414 1.414M7.757 17.657l-1.414 1.414m12.728 0l-1.414-1.414M7.757 6.343L6.343 4.929" />
          </svg>
        ) : (
          "Ingresar"
        )}
      </button>

      <div className='flex flex-col items-center gap-4 mt-6'>
        <button
          type="button"
          onClick={() => onSwitch('register')}
          className='text-sm border border-white/20 rounded-xl p-3 w-full hover:bg-white/5 hover:border-secondary hover:text-secondary transition-colors'
        >
          ¿No tienes una cuenta aún? <span className='font-bold ml-1 text-primary'>Regístrate</span>
        </button>
      </div>
    </form>
  )
}