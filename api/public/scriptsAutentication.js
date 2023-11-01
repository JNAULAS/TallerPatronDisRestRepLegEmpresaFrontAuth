// URL del server
const urlServer = 'http://localhost:3006'
let path = '/auth/signin'
let pathConsultaRoles = '/auth/signin'
let pathCreacionUsuario = '/users'
let pathRoles = '/roles'
// Se crea api generica para cunsumir servicios rest
async function getApi(paramMethod, paramUrl, paramBody) {
    console.log('URL ACCESO API')
    console.log(paramUrl)
    let data
    const requestOptions = {
        method: paramMethod,//'POST', 'GET' / 'PUT'
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            mode: 'no-cors',
        },
        body: paramBody ? JSON.stringify(paramBody) : null,
    };

    const res = await fetch(paramUrl, requestOptions)
    if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
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
        alert('Los campos no pueden estar vación ingrese la información necesaria')
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
            console.log(dataRetun)

            // Autorización
            window.location.href = './legalRepresentative.html';
        }

    } catch (error) {
        console.log('Datos de cash')
        if (error.includes('Error en la solicitud: 401 - Unauthorized')) {
            alert('Acceso no permitido solicite los permisos necesarios')//
        } else if (error.includes('Error en la solicitud: 400 - Bad Request')) {
            alert('Se ha producido un error en el sistema, por favor notifique el administrador')
        }

        console.log(error)
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
    if(!validarCorreoElectronico(paramCorreo)){
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

const  validarCorreoElectronico = (correo) => {
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