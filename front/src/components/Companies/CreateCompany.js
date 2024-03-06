import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const endpoint = "http://localhost:8000/api"; // Base URL para las solicitudes API

const CreateCompany = () => {
    const [services, setServices] = useState([]);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [errorsPhone, setErrorsPhone] = useState([]);
    const [nit, setNit] = useState("");
    const [documents, setDocuments] = useState();
    const [statusCompany, setStatusCompany] = useState("Inactiva");
    const [verificationCode, setVerificationCode] = useState();
    const [selectedServices, setSelectedServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get("casoDiego") === undefined) {
            navigate("/");
        }

        getAllServices();
    }, []);

    // Obtener todos los servicios disponibles
    const getAllServices = async () => {
        try {
            const response = await axios.get(`${endpoint}/servicios`);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    // Manejar cambios en la selección de servicios
    const handleServiceChange = (serviceId) => {
        const updatedServices = [...selectedServices];
        if (updatedServices.includes(serviceId)) {
            const index = updatedServices.indexOf(serviceId);
            updatedServices.splice(index, 1);
        } else {
            updatedServices.push(serviceId);
        }
        setSelectedServices(updatedServices);
    };

    // Manejar la validación del código de verificación
    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${endpoint}/company/verify`, {
                name: name,
                address: address,
                phone: phone,
                nit: nit,
                documents: documents,
                statusCompany: statusCompany,
                verification_code: verificationCode,
                idService: selectedServices,
                //user_verification_code: enteredVerificationCode
            });
            navigate(-1); // Redirigir después de guardar la compañía
            toast.success("¡La compañía fue registrada y está lista para aprobación!");
        } catch (error) {
            console.error("se va para aqui:", error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container-fluid mt-4 px-md-5">
            <h1 className="text-center mb-4">CREAR COMPAÑIAS</h1>
            <div className="container-fluid mt-4 px-md-5 d-flex align-items-center justify-content-center">
                <div className="d-flex justify-content-center border p-2 rounded w-50 rounded">
                    <form onSubmit={handleVerificationSubmit} className="col-md-6 w-75">
                        <div className="mb-3">
                            <label className="form-label fs-5">Nombre de la compañia</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Dirección</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">NIT</label>
                            <input
                                type="number"
                                value={nit}
                                onChange={(e) => setNit(e.target.value)}
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
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
									${errorsPhone.length > 0 ? "is-invalid" : ""}`}
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
                            <label className="form-label fs-5">Servicios</label>
                            {services.map((service) => (
                                <div key={service.id} className="form-check text-start">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`serviceCheckbox${service.id}`}
                                        checked={selectedServices.includes(service.id)}
                                        onChange={() => handleServiceChange(service.id)}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`serviceCheckbox${service.id}`}
                                    >
                                        {service.description}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">
                                Documento general de la compañía
                            </label>
                            <input
                                type="file"
                                value={documents}
                                onChange={(e) => setDocuments(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fs-5">Estado de la compañia</label>
                            <input
                                type="text"
                                value={statusCompany}
                                onChange={(e) => setStatusCompany(e.target.value)}
                                className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
                                readOnly // Esto evita que el usuario edite el campo
                            />
                        </div><br/>
                        <div className="mb-3 text-center">
                        <button type="submit" className="btn btn-primary" tabIndex="4">
                                Guardar en espera
                        </button><br/><br/>
                        <button
                            onClick={handleGoBack}
                            className="btn btn-warning btn-md mx-1"
                            >
                            {" "}
                            Cancelar{" "}
                        </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* ToastContainer para mostrar las notificaciones */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CreateCompany;
