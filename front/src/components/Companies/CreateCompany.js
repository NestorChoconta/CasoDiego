import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const endpoint = "http://localhost:8000/api"; // Base URL para las solicitudes API

const CreateCompany = () => {
	const [services, setServices] = useState([]);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [errorsPhone, setErrorsPhone] = useState([]);
	const [nit, setNit] = useState("");
	const [documents, setDocuments] = useState("");
	const [fileInput, setFileInput] = useState(null);
	const [statusCompany, setStatusCompany] = useState("Inactiva");
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

	// Manejar cambio en el input de archivo
	const handleFileChange = async (e) => {
		setFileInput(e.target.files[0]);
		setDocuments(e.target.value);
	};

    // Manejar la validación del código de verificación
    const handleVerificationSubmit = async (e) => {
        e.preventDefault();

        //Se crea para que lo pase a string
        const Phone = phone.toString();
        // Validar que el número de telefono tenga 10 dígitos
        if (Phone.length < 10 || Phone.length > 10) {
            setErrorsPhone(["El número de telefono debe tener 10 números."]);
            return;
        } else {
            setErrorsPhone([]);
        }

        try {
            const responseForm = {
                name: name,
                address: address,
                phone: phone,
                nit: nit,
                statusCompany: statusCompany,
                idService: selectedServices,
                documents: fileInput  // Incluir el archivo aquí
            };
            
            try {
                const response = await axios.post(`${endpoint}/company/verify`, responseForm, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                console.log(response);
    
                navigate(-1);
                toast.success("¡La compañía fue registrada y está lista para aprobación!");
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    const { nitError, phoneError } = error.response.data;
    
                    if (nitError) {
                        toast.error(nitError);
                    }
    
                    if (phoneError) {
                        toast.error(phoneError);
                    }
                } else {
                    console.error("Error al crear la compañía:", error.message);
                }
            }
        } catch (error) {
            console.error("se va para aqui:", error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    // función para manejar el cambio en la selección de servicios
    const handleServiceChange = (serviceId) => {
        const updatedServices = [...selectedServices];
        if (updatedServices.includes(serviceId)) {
            // si ya está seleccionado, lo eliminamos
            const index = updatedServices.indexOf(serviceId);
            updatedServices.splice(index, 1);
        } else {
            // si no está seleccionado, lo añadimos
            updatedServices.push(serviceId);
        }
        // cambia el estado del servicio seleccinado
        setSelectedServices(updatedServices);
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
                                onChange={handleFileChange}
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
