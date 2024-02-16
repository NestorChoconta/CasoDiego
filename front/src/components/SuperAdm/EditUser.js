import React, {useState, useEffect} from "react"
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from "js-cookie"

const endpoint = 'http://localhost:8000/api/usuario/'

const EditUser = () => {
    const [documentTypes, setDocumentTypes] = useState([])
    const [roles, setRoles] = useState([])
    const [errorsNumDoc, setErrorsNumDoc] = useState([])
    const [errorsPhone, setErrorsPhone] = useState([])
    const [firstName, setFirstName] = useState ('')
    const [secondName, setSecondName] = useState ('')
    const [Surname, setSurname] = useState ('')
    const [secondSurname, setSecondSurname] = useState ('')
    const [numDocument, setNumDocument] = useState ()
    const [birthdate, setBirthdate] = useState ('')
    const [email, setEmail] = useState ('')
    const [password, setPassword] = useState ('')
    const [phone, setPhone] = useState ()
    const [adress, setAdress] = useState ('')
    const [idRole, setIdRole] = useState ()
    const [idDocumentType, setIdDocumentType] = useState ()
    const {id} = useParams()
    const navigate = useNavigate()


    useEffect(()=> {
		if (Cookies.get('casoDiego')=== undefined) {
			navigate('/')
		}
	})

    
    const update = async (e) => {
        e.preventDefault()

        // Validar que el número de documento tenga 8 o 10 dígitos
        const numDoc = numDocument.toString()
        // Validar que el número de documento tenga 8 o 10 dígitos
        if (numDoc.length < 8 || numDoc.length === 9 || numDoc.length > 10) {
            setErrorsNumDoc(['El número de documento debe tener 8 o 10 números.'])
            return
        } else {
            setErrorsNumDoc([])
        }

        //Se crea para que lo pase a string 
        const Phone = phone.toString()
        // Validar que el número de telefono tenga 10 dígitos
        if (Phone.length < 10 || Phone.length > 10) {
            setErrorsPhone(['El número de telefono debe tener 10 números.'])
            return
        } else {
            setErrorsPhone([])
        }

        try {
            await axios.put(`${endpoint}${id}`, {
                firstName: firstName,
                secondName: secondName,
                Surname: Surname,
                secondSurname: secondSurname,
                numDocument: numDocument,
                birthdate: birthdate,
                email: email,
                password: password,
                phone: phone,
                adress: adress,
                idRole: idRole,
                idDocumentType: idDocumentType
            })
            navigate('/usuarios')
        } catch (error) {
            handleError(error)
        }
    }

    const handleError = (error) => {
        if (error.response && error.response.status === 422) {
            toast(error.response.data.error, {
                appearance: 'error',
                autoDismiss: true,
            })
        } else {
            toast('Error desconocido. Inténtalo de nuevo.', {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }

    useEffect(() => {
        const getAllRolDocType = async () => {
            const documentTypesResponse = await axios.get(`http://localhost:8000/api/document-types`)
            const rolesResponse = await axios.get(`http://localhost:8000/api/roles`)
            setDocumentTypes(documentTypesResponse.data)
            setRoles(rolesResponse.data)
        }

        getAllRolDocType()

        const getUserById = async () => {
            const response = await axios.get(`${endpoint}${id}`)
            setFirstName(response.data.firstName)
            setSecondName(response.data.secondName)
            setSurname(response.data.Surname)
            setSecondSurname(response.data.secondSurname)
            setNumDocument(response.data.numDocument)
            setBirthdate(response.data.birthdate)
            setEmail(response.data.email)
            setPassword(response.data.password)
            setPhone(response.data.phone)
            setAdress(response.data.adress)
            setIdRole(response.data.idRole)
            setIdDocumentType(response.data.idDocumentType)
        }
        getUserById()

    }, [id])

    return (
        <div className="container-fluid mt-4 px-md-5">
            <h1 className="text-center mb-4">EDITAR USUARIO</h1>
            <div className='container-fluid mt-4 px-md-5 d-flex align-items-center justify-content-center'>
                <div className="d-flex justify-content-center border p-2 rounded w-50 rounded">
                    <form onSubmit={update} className="col-md-6 w-75">
                        <div className="mb-3">
                            <label className="form-label fs-5">Primer Nombre</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={ (e)=> setFirstName(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Segundo Nombre</label>
                            <input
                                type="text"
                                value={secondName}
                                onChange={ (e)=> setSecondName(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Primer Apellido</label>
                            <input
                                type="text"
                                value={Surname}
                                onChange={ (e)=> setSurname(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Segundo Apellido</label>
                            <input
                                type="text"
                                value={secondSurname}
                                onChange={ (e)=> setSecondSurname(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Tipo de documento</label>
                            <select  value={idDocumentType} onChange={ (e)=> setIdDocumentType(e.target.value) }
                            className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom" required>
                                <option disabled value="">Seleccione el tipo de documento</option>
                                {documentTypes.map((documentType) => (
                                    <option key={documentType.id} value={documentType.id}>
                                        {documentType.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Numero de documento</label>
                            <input
                                type="number"
                                value={numDocument}
                                onChange={(e) => {
                                    setNumDocument(e.target.value);
                                    setErrorsNumDoc([]);
                                }}
                                className={`form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom 
                                    ${
                                        errorsNumDoc.length > 0 ? 'is-invalid' : ''
                                    }`
                                }
                                required
                            />
                            {errorsNumDoc.length > 0 && (
                                <div className="invalid-feedback">
                                    {errorsNumDoc.map((error, index) => (
                                        <p key={index} className="text-danger">
                                            {error}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Fecha de nacimiento</label>
                            <input
                                type="date"
                                value={birthdate}
                                onChange={ (e)=> setBirthdate(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Correo</label>
                            <input
                                type="email"
                                value={email}
                                onChange={ (e)=> setEmail(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={ (e)=> setPassword(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Telefono</label>
                            <input
                                type="number"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setErrorsPhone([]);
                                }}
                                className={`form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom 
                                    ${
                                        errorsPhone.length > 0 ? 'is-invalid' : ''
                                    }`
                                }
                                required 
                            />
                            {errorsPhone.length > 0 && (
                                <div className="invalid-feedback">
                                    {errorsPhone.map((error, index) => (
                                        <p key={index} className="text-danger">
                                            {error}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Dirección</label>
                            <input
                                type="text"
                                value={adress}
                                onChange={ (e)=> setAdress(e.target.value) }
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Rol</label>
                            <select value={idRole} onChange={ (e)=> setIdRole(e.target.value) }
                            className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom" required>
                                <option disabled selected>Seleccione el rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.id} value={rol.id}>
                                        {rol.role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Link to="/usuarios" className="btn btn-warning btn-md mx-1"> Cancelar </Link>
                        <button  type="submit" className="btn btn-primary" tabIndex="4">Guardar Cambios</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
            <br></br>
        </div>
    )
}

export default EditUser