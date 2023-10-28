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
    console.log('Antes del param')
    // Arma Json de consulta
    const param = {
        email: paramUser,
        password: paramPassword
    }
    console.log(param)
    const dataRetun = await getApi('POST', `${urlServer}${path}`, param);
    if (dataRetun.token != '') {
        console.log(dataRetun)
        //alert(`Representante Legal registrado con exito para la empresa: ${dataRetun.token}`)
        window.location.href = './legalRepresentative.html';
    } else {
        alert(dataRetun.erorr)
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
    dataRetun.body.forEach(element => {
        var option = document.createElement("option");
        option.text = element.nombre
        option.value = element._id
        listItemFront.add(option)
    });
}

async function handleSaveUser() {
    // Get value input Representate Legal
    const paramUser = document.getElementById('inputUser').value
    const paramCorreo = document.getElementById('inputcorreo').value
    const paramPassword = document.getElementById('inputPassword').value
    //const paramRol = document.getElementById('inputcorreo').value

    // Control de ingreso de informcion
    if (paramUser == '' || paramPassword == '') {
        alert('Los campos no pueden estar vación ingrese la información necesaria')
        return false
    }
    console.log('Antes del param')
    // Arma Json de consulta
    const param = {
        username: paramUser,
        email: paramCorreo,
        password: paramPassword,
        roles: 'administrador'
    }
    console.log(param)
    const dataRetun = await getApi('POST', `${urlServer}${pathCreacionUsuario}`, param);
    console.log('Datos retorno')
    console.log(dataRetun)
    /*
    if (dataRetun != '') {
        console.log(dataRetun)
        //alert(`Representante Legal registrado con exito para la empresa: ${dataRetun.token}`)
        window.location.href = './legalRepresentative.html';
    } else {
        alert(dataRetun.erorr)
    }
*/
}