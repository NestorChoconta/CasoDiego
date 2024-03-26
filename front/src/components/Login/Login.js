import React, { useState } from "react";
import axios from "axios";
import clientNormal from "../../img/clientNormal.png";
import clientJudicial from "../../img/clientJudicial.png";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CreateCompany from "../Companies/CreateCompany";
import CreateClient from "../Clients/CreateClient";
import { ToastContainer ,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verification_code, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [verificationAlert, setVerificationAlert] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showModalClient, setShowModalClient] = useState(false);
    const [showModalCompany, setShowModalCompany] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });

            let data = response.data;
            const { access_token, verification_code } = response.data;
            setToken(access_token);
            Cookies.set("casoDiego", access_token);

            const idRole = data.idRole;
            const data2 = {
                email: email,
                password: password,
                idRole: idRole,
                firstName: data.user.firstName,
                Surname: data.user.Surname,
                id: data.user.id,
            };

            dispatch(addUser(data2));

            setVerificationAlert(verification_code);
            setVerificationAlert("El codigo fue enviado a su correo electronico");

            setShowVerification(true);

        } catch (error) {
            setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
            console.log(error);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get("casoDiego");
    
            const response = await axios.post("http://localhost:8000/api/verify-code", {
                verification_code: verification_code,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            let data = response.data;
            const idRole = data.idRole;
    
            if (idRole === 1) {
                navigate("/MenuSuperAdmin");
            } else if (idRole === 2) {
                navigate("/MenuAdmin");
            } else if (idRole === 3) {
                navigate("/MenuEmple");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError("Código de verificación incorrecto.");
            console.log(error);
        }
    };

    const ModalCloseSinNoti = () =>{
        setShowModal(false) // Cerrar el modal de selección de tipo de cliente
    }

    const handleCompanyRegistered = () => {
        toast.success("¡La compañía fue registrada y está lista para aprobación!");
        setShowModalCompany(false); // Cerrar el modal de registro de compañía
        setShowModal(true); // Volver al modal de selección de tipo de cliente
    };

    const handleClientRegistered = () => {
        toast.success("El cliente fue registrada exitosamente!");
        setShowModalClient(false); // Cerrar el modal de registro de cliente
        setShowModal(true); // Volver al modal de selección de tipo de cliente
    };

    const closeVerificationModal = () => {
        setShowVerification(false);
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            <div className="border p-4 rounded w-25">
                <h2 className="text-center mb-4">Iniciar sesión</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fs-5">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fs-5">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                        />
                    </div>
                    <button type="submit" className="btn btn-success">
                        Iniciar sesión
                    </button><br/><br/>
                </form>
                <div style={{ marginLeft: 'auto' }}>
                    <Link to="#" className="btn btn-link btn-md mx-1" onClick={() => setShowModal(true)}>
                        ¿Deseas registrar un cliente?
                    </Link>
                </div>
                {verificationAlert && (
                    <div className="alert alert-info" role="alert">
                        Código de verificación: {verificationAlert}
                    </div>
                )}
            </div>
            {showVerification && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Verificación</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeVerificationModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleVerificationSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="verification_code" className="form-label fs-5">
                                            Código de verificación:
                                        </label>
                                        <input
                                            type="text"
                                            id="verification_code"
                                            value={verification_code}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Verificar Código
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tipo de cliente</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => ModalCloseSinNoti()}></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center">
                            <div className="row">
                                <div className="col-md-6 d-flex flex-column align-items-center">
                                    <div className="mb-3">
                                        <img src={clientNormal} style={{ width: '40%' }} alt="Cliente Normal" className="img-fluid" />
                                    </div>
                                    <div className="mb-3">
                                        <button className="btn btn-primary" onClick={() => { setShowModal(false); setShowModalClient(true); }}>Cliente Normal</button>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex flex-column align-items-center">
                                    <div className="mb-3">
                                        <img src={clientJudicial} style={{ width: '50%' }} alt="Cliente Judicial" className="img-fluid" />
                                    </div>
                                    <div>
                                        <button className="btn btn-primary" onClick={() => { setShowModal(false); setShowModalCompany(true); }}>Cliente Judicial</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
			{/* Modal para registrar un cliente normal */}
            {showModalClient && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registrar cliente normal</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModalClient(false)}></button>
                            </div>
                            <div className="modal-body">
                                <CreateClient closeModal={() => setShowModalClient(false)} handleClientRegistered={handleClientRegistered} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para registrar una compañía */}
            {showModalCompany && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registrar cliente judicial</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModalCompany(false)}></button>
                            </div>
                            <div className="modal-body">
                                <CreateCompany closeModal={() => setShowModalCompany(false)} handleCompanyRegistered={handleCompanyRegistered} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Login;
