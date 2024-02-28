import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verification_code, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [showVerification, setShowVerification] = useState(false); // Controla si se muestra el formulario de verificación
    const [verificationAlert, setVerificationAlert] = useState(""); // Controla la visibilidad de la alerta de verificación
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });

            let data = response.data;
            const { access_token, verification_code } = response.data; // Obtener el código de verificación de la respuesta
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

            // Mostrar el formulario de verificación después de iniciar sesión
            setShowVerification(true);
        } catch (error) {
            setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
            console.log(error);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        try {
            // Obtener el token de acceso almacenado en las cookies o en el almacenamiento local
            const token = Cookies.get("casoDiego");
    
            // Realizar la solicitud al servidor para verificar el código
            const response = await axios.post("http://localhost:8000/api/verify-code", {
                verification_code: verification_code,
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluir el token de acceso en el encabezado
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
                {/* Mostrar la alerta de verificación */}
                {verificationAlert && (
                    <div className="alert alert-info" role="alert">
                        Código de verificación: {verificationAlert}
                    </div>
                )}
                {/* Mostrar el formulario de verificación después de iniciar sesión */}
                {showVerification && (
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
                )}
            </div>
        </div>
    );
}

export default Login;
