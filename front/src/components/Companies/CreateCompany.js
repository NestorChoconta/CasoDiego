import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

const endpoint = "http://localhost:8000/api/compañia";

const CreateCompany = () => {
	const [services, setServices] = useState([]);
	const [name, setName] = useState("");
	const [adress, setAdress] = useState("");
	const [phone, setPhone] = useState("");
	const [errorsPhone, setErrorsPhone] = useState([]);
	const [nit, setNit] = useState("");
	const [client_serv_contract, setClient_serv_contract] = useState();
	const [statusCompany, setStatusCompany] = useState('activo');
	const [verification_code, setVerification_code] = useState();
	const [idService, setIdService] = useState();
	const navigate = useNavigate();

	useEffect(()=> {
		if (Cookies.get('casoDiego')=== undefined) {
			navigate('/')
		}

		getAllServices();
	},[])

	// Cargar tipos de documento, compañias y usuarios
	const getAllServices = async () => {
		const servicesResponse = await axios.get(`http://localhost:8000/api/servicios`);
		setServices(servicesResponse.data);
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

		await axios.post(`${endpoint}`, {
			name: name,
			adress: adress,
			phone: phone,
			nit: nit,
			client_serv_contract: client_serv_contract,
			statusCompany: statusCompany,
			verification_code: verification_code,
			idService: idService,
		});
		navigate("/compañias");
	};

	const handleGoBack = () => {
		navigate(-1); // Regresar a la página anterior
	};

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1 className="text-center mb-4">CREAR COMPAÑIAS</h1>
			<div className="container-fluid mt-4 px-md-5 d-flex align-items-center justify-content-center">
				<div className="d-flex justify-content-center border p-2 rounded w-50 rounded">
					<form onSubmit={store} className="col-md-6 w-75">
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
								value={adress}
								onChange={(e) => setAdress(e.target.value)}
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
							<label className="form-label fs-5">Tipo de documento</label>
							<select
								value={idDocumentType}
								onChange={(e) => setIdDocumentType(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
								required
							>
								<option disabled selected>
									Seleccione el tipo de documento
								</option>
								{documentTypes.map((documentType) => (
									<option key={documentType.id} value={documentType.id}>
										{documentType.description}
									</option>
								))}
							</select>
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
							<label className="form-label fs-5">Nombre de la Compañia</label>
							<select
								value={idCompany}
								onChange={(e) => setIdCompany(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
								required
							>
								<option disabled selected>
									Seleccione la compañia
								</option>
								{companies.map((company) => (
									<option key={company.id} value={company.id}>
										{company.name}
									</option>
								))}
							</select>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Estado</label>
							<select
								value={statusCompany}
								onChange={(e) => setStatusCompany(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
							>
								<option value="Activo">Activa</option>
								<option value="Inactivo">Inactiva</option>
							</select>
						</div>
						<div className="mb-3 text-center">
							<button onClick={handleGoBack} className="btn btn-warning btn-md mx-1" > Cancelar </button>
							<button onClick={handleGoBack} type="submit" className="btn btn-primary" tabIndex="4"> Guardar </button>
						</div>
					</form>
				</div>
			</div>
			<br></br>
		</div>
	);
};

export default CreateCompany;
