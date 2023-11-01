// URL del server
const urlServer = 'http://localhost:3006'
let path = '/auth/signin'
let pathConsultaRoles = '/auth/signin'
let pathCreacionUsuario = '/users'
let pathRoles = '/roles'
// Valida tocken
let pathTockenValido = '/tockenVerifica/verifica'

let almacenaTocken = '';
// Se crea api generica para cunsumir servicios rest
async function getApi(paramMethod, paramUrl, paramBody, tocken) {
    console.log('URL ACCESO API')
    console.log(paramUrl)
    let data
    const requestOptions = {
        method: paramMethod,//'POST', 'GET' / 'PUT'
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: paramBody ? JSON.stringify(paramBody) : null,
    };
    console.log('tockens almacenado')
    console.log(almacenaTocken)
    const requestOptionsTockens = {
        method: paramMethod,//'POST', 'GET' / 'PUT'
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': almacenaTocken
        },
        body: paramBody ? JSON.stringify(paramBody) : null,
    };
    const requestFinal = almacenaTocken === '' ? requestOptions : requestOptionsTockens

    const res = await fetch(paramUrl, requestFinal)
    if (!res.ok) {
        console.log('Informacion de rest')
        console.log(res)
        //throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
        if (res.status === 401) {
            throw new Error('Acceso no permitido.');
        } else if (res.status === 400) {
            throw new Error('Se ha producido un error en el sistema.');
        } else if (res.status === 403) {
            throw new Error('Rol no asignado.');
        } else {
            throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
        }
    }
    data = await res.json()
    return data
}

async function login() {
    // Get value input Representate Legal
    const paramUser = document.getElementById('inputCorreo').value
    const paramPassword = document.getElementById('inputPassword').value
    console.log('Acceso autentication')

    // Control de ingreso de informcion
    if (paramUser == '' || paramPassword == '') {
        alert('Los campos no pueden estar vaciós ingrese la información necesaria')
        return false
    }
    // 1. Identificación
    const param = {
        email: paramUser,
        password: paramPassword
    }
    try {

        // 2. Autenticación
        const dataRetun = await getApi('POST', `${urlServer}${path}`, param);
        if (dataRetun.token != '') {
            almacenaTocken = dataRetun.token;
            // Verifica validez del tocken
            const tockenValido = await getApi('GET', `${urlServer}${pathTockenValido}`);
            console.log('Verifica tockes varificado ')
            console.log(tockenValido)


            // Autorización
            window.location.href = './legalRepresentative.html';
        }

    } catch (error) {
        console.error('Error durante la autenticación:', error.message);

        if (error.message === 'Acceso no permitido.') {
            alert('Acceso no permitido. Solicite los permisos necesarios');
        } else if (error.message === 'Se ha producido un error en el sistema.') {
            alert('Se ha producido un error en el sistema. Por favor notifique al administrador');
        } else if (error.message === 'Rol no asignado.') {
            alert('Usted no cuenta con un Rol de administrador para acceder a este Servicio.');
        } else {
            alert('Ocurrió un error inesperado. Por favor, inténtelo nuevamente más tarde.');
        }
    }

}

// Seccion para creación de usuarios
async function getListRoles() {
    let path = 'empresa'
    var listItemFront = document.getElementById("listaRoles")
    // Consume Api
    const dataRetun = await getApi('GET', `${urlServer}${pathRoles}`);
    console.log(JSON.stringify(dataRetun))
    // Recorre lista que retorna el servicio
    dataRetun.list_roles.forEach(element => {
        var option = document.createElement("option");
        option.text = element.name
        option.value = element._id
        listItemFront.add(option)
    });
}

async function handleSaveUser() {
    // Get value input Representate Legal
    const paramUser = document.getElementById('inputUser').value
    const paramPassword = document.getElementById('inputPassword').value
    const paramNombres = document.getElementById('inputNombres').value
    const paramApellidos = document.getElementById('inputApellidos').value
    const paramCorreo = document.getElementById('inputcorreo').value
    const paramListRoles = document.getElementById("listaRoles")
    // Obtener el índice del elemento seleccionado
    const selectedOption = paramListRoles.options[paramListRoles.selectedIndex]
    const nameRol = selectedOption.text;
    console.log('Datos de la lista')
    console.log(nameRol)

    // Control de ingreso de informcion
    if (paramUser == '' || paramPassword == '' || paramNombres == '' || paramApellidos == '' || paramCorreo == '') {
        alert('Los campos no pueden estar vacios ingrese la información necesaria para continuar.')
        return false
    }
    if (!validarCorreoElectronico(paramCorreo)) {
        alert('La dirección de correo ingresada es invalida.')
        return false
    }
    console.log('Antes del param')
    // Arma Json de consulta
    const param = {
        username: paramUser,
        password: paramPassword,
        name: paramNombres,
        lastName: paramApellidos,
        email: paramCorreo,
        roles: nameRol //'administrador'
    }
    try {
        const dataRetun = await getApi('POST', `${urlServer}${pathCreacionUsuario}`, param);
        alert(`Bienvenido ${dataRetun.name + ' ' + dataRetun.lastName + ' '}, su usuario asignado es: ${dataRetun.username} `)
    } catch (error) {
        alert('Error en registro de Usuario.')
    }

}
// Ejecuciones automaticas
document.addEventListener("DOMContentLoaded", function () {
    getListRoles();
});

const validarCorreoElectronico = (correo) => {
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Usamos la función test() para comprobar si el correo cumple con la expresión regular
    if (regexCorreo.test(correo)) {
        return true; // La dirección de correo es válida
    } else {
        return false; // La dirección de correo no es válida
    }
}

const handleCancelar = () => {
    window.location.href = './index.html';
}