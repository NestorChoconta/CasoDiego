import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const endpoint = "http://localhost:8000/api/company/";

const EditCompany = () => {
	const [services, setServices] = useState([]);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [errorsPhone, setErrorsPhone] = useState([]);
	const [nit, setNit] = useState("");
	const [statusCompany, setStatusCompany] = useState("Activa");
	const [selectedServices, setSelectedServices] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}
		getAllServices();
		getCompanyById();
	}, [id]);

	// Cargar servicios
	const getAllServices = async () => {
		const servicesResponse = await axios.get(
			`http://localhost:8000/api/servicios`
		);
		setServices(servicesResponse.data);
	};

	const getCompanyById = async () => {
		const response = await axios.get(`${endpoint}${id}`);
		setName(response.data.name);
		setAddress(response.data.address);
		setPhone(response.data.phone);
		setNit(response.data.nit);
		setStatusCompany(response.data.statusCompany);
		setSelectedServices(response.data.services.map(service => service.id));
	};

	const update = async (e) => {
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

		await axios.put(`${endpoint}${id}`, {
			name: name,
			address: address,
			phone: phone,
			nit: nit,
			statusCompany: statusCompany,
			idService: selectedServices,
		});
		navigate(-1);
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
			<h1 className="text-center mb-4">EDITAR COMPAÑIA</h1>
			<div className="container-fluid mt-4 px-md-5 d-flex align-items-center justify-content-center">
				<div className="d-flex justify-content-center border p-2 rounded w-50 rounded">
					<form
						onSubmit={update}
						className="col-md-6 w-75"
						enctype="multipart/form-data"
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
							{services &&
								services.map((service) => (
									<div key={service.id} className="form-check text-start">
										<input
											className="form-check-input"
											type="checkbox"
											id={`serviceCheckbox${service.id}`}
											checked={
												selectedServices
													? selectedServices.includes(service.id)
													: false
											}
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
						<div className="mb-3 text-center">
							<button
								onClick={handleGoBack}
								className="btn btn-warning btn-md mx-1"
							>
								Cancelar
							</button>
							<button type="submit" className="btn btn-primary" tabIndex="4">
								Guardar Cambios
							</button>
						</div>
					</form>
				</div>
			</div>
			<br></br>
		</div>
	);
};

export default EditCompany;
