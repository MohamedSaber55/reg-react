import Swal from 'sweetalert2';

export const showSuccessNotification = (message) => {
    Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
    });
};

export const showErrorNotification = (message) => {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
    });
};
