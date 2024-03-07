import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const endpoint = "http://localhost:8000/api/company";

const CreateCompany = () => {
	const [services, setServices] = useState([]);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [errorsPhone, setErrorsPhone] = useState([]);
	const [nit, setNit] = useState("");
	const [documents, setDocuments] = useState("");
	const [fileInput, setFileInput] = useState(null);
	const [statusCompany, setStatusCompany] = useState("Activa");
	const [verification_code, setVerification_code] = useState();
	const [selectedServices, setSelectedServices] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}

		getAllServices();
	}, []);

	// Cargar servicios
	const getAllServices = async () => {
		const servicesResponse = await axios.get(
			`http://localhost:8000/api/servicios`
		);
		setServices(servicesResponse.data);
	};

	// Manejar cambio en el input de archivo
	const handleFileChange = async (e) => {
		setFileInput(e.target.files[0]);
		setDocuments(e.target.value);
	};

	const store = async (e) => {
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

		const responseForm = {
			name: name,
			address: address,
			phone: phone,
			nit: nit,
			statusCompany: statusCompany,
			verification_code: verification_code,
			idService: selectedServices,
			documents: fileInput  // Incluir el archivo aquí
		};
		
		try {
            const response = await axios.post(endpoint, responseForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response);

            navigate(-1);
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
	};

	const handleGoBack = () => {
		navigate(-1); // Regresar a la página anterior
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
					<form
						onSubmit={store}
						className="col-md-6 w-75"
						encType="multipart/form-data"
					>
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
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">NIT</label>
							<input
								type="number"
								value={nit}
								onChange={(e) => setNit(e.target.value)}
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
																			errorsPhone.length > 0 ? "is-invalid" : ""
																		}`}
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
						<br></br>
						<div className="mb-3">
							<label className="form-label fs-5">
								Documento general de la compañía (SOLO PDF)
							</label>
							<input
								type="file"
								value={documents}
								onChange={handleFileChange}
								className="form-control"
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Estado de la compañia</label>
							<select
								value={statusCompany}
								onChange={(e) => setStatusCompany(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
								required
							>
								<option value="Activa">Activa</option>
								<option value="Inactiva">Inactiva</option>
							</select>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Codigo de verificación</label>
							<input
								type="number"
								value={verification_code}
								onChange={(e) => setVerification_code(e.target.value)}
								className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
							/>
						</div>
						<div className="mb-3 text-center">
							<button
								onClick={handleGoBack}
								className="btn btn-warning btn-md mx-1"
							>
								{" "}
								Cancelar{" "}
							</button>
							<button type="submit" className="btn btn-primary" tabIndex="4">
								{" "}
								Guardar{" "}
							</button>
						</div>
					</form>
				</div>
			</div>
			<ToastContainer />
			<br></br>
		</div>
	);
};

export default CreateCompany;