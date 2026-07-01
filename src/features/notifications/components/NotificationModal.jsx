export const NotificationModal = ({ isOpen, onClose, notification }) => {
	if (!isOpen || !notification) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
			<div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl">
				<div className="bg-[linear-gradient(90deg,var(--color-brand-dark)_0%,var(--color-brand-red-dark)_100%)] p-5 text-white">
					<h2 className="text-2xl font-bold">Detalle de Notificación</h2>
					<p className="text-sm opacity-80">Consulta rápida del contenido recibido</p>
				</div>

				<div className="space-y-4 p-5">
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Título</p>
						<p className="mt-1 text-lg font-semibold">{notification.title}</p>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Mensaje</p>
						<p className="mt-1 text-sm text-[var(--text-secondary)]">{notification.message}</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Tipo</p>
							<p className="mt-1 text-sm">{notification.type}</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Referencia</p>
							<p className="mt-1 text-sm">{notification.referenceType} - {notification.referenceId}</p>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Estado</p>
							<p className="mt-1 text-sm">{notification.isRead ? "Leída" : "No leída"}</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Fecha</p>
							<p className="mt-1 text-sm">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "N/A"}</p>
						</div>
					</div>

					<div className="flex justify-end">
						<button onClick={onClose} className="rounded-xl bg-[var(--color-brand-dark)] px-4 py-2.5 text-sm font-medium ">
							Cerrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
