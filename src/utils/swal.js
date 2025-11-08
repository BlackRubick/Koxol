import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export const showAlert = (titleOrMessage, messageOrOpts = '') => {
  if (typeof messageOrOpts === 'object') {
    return Swal.fire({ title: titleOrMessage || '', ...messageOrOpts })
  }
  // If only one string passed, show it as text
  if (!messageOrOpts) return Swal.fire({ text: titleOrMessage, icon: 'info' })
  return Swal.fire({ title: titleOrMessage, text: messageOrOpts, icon: 'info' })
}

export const showSuccess = (title = 'Listo', text = '') => Swal.fire({ title, text, icon: 'success' })
export const showError = (title = 'Error', text = '') => Swal.fire({ title, text, icon: 'error' })
export const showInfo = (title = '', text = '') => Swal.fire({ title, text, icon: 'info' })

export const confirmDialog = (title = '¿Estás seguro?', text = '', opts = {}) => {
  // opts: { confirmButtonText, cancelButtonText, confirmButtonColor, cancelButtonColor, icon }
  const {
    confirmButtonText = 'Sí',
    cancelButtonText = 'Cancelar',
    confirmButtonColor = '#16a34a', // green
    cancelButtonColor = '#6b7280', // gray
    icon = 'warning'
  } = opts || {};

  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor
  }).then(res => !!res.isConfirmed)
}

export default {
  showAlert,
  showSuccess,
  showError,
  showInfo,
  confirmDialog
}
