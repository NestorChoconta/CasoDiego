import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

const endpoint = "http://localhost:8000/api/cliente";

const CreateClient = () => {
	const [documentTypes, setDocumentTypes] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [users, setUsers] = useState([]);
	const [errorsNumDoc, setErrorsNumDoc] = useState([]);
	const [errorsPhone, setErrorsPhone] = useState([]);
	const [firstNameClient, setFirstNameClient] = useState("");
	const [secondNameClient, setSecondNameClient] = useState("");
	const [SurnameClient, setSurnameClient] = useState("");
	const [secondSurnameClient, setSecondSurnameClient] = useState("");
	const [numDocument, setNumDocument] = useState();
	const [phone, setPhone] = useState();
	const [idDocumentType, setIdDocumentType] = useState();
	const [idCompany, setIdCompany] = useState();
	const [idUser, setIdUser] = useState();
	const [statusClient, setStatusClient] = useState('activo');
	const navigate = useNavigate();

	useEffect(()=> {
		if (Cookies.get('casoDiego')=== undefined) {
			navigate('/')
		}

		getAllUsuDocTypeComp();
	},[])

	// Cargar tipos de documento, compañias y usuarios
	const getAllUsuDocTypeComp = async () => {
		const documentTypesResponse = await axios.get(`http://localhost:8000/api/document-types`);
		const usersResponse = await axios.get(`http://localhost:8000/api/usuarios`);
		const companiesResponse = await axios.get(`http://localhost:8000/api/companies`);
		setDocumentTypes(documentTypesResponse.data);
		setUsers(usersResponse.data);
		setCompanies(companiesResponse.data);
	};

	const store = async (e) => {
		e.preventDefault();
		const numDoc = numDocument.toString();
		// Validar que el número de documento tenga 8 o 10 dígitos
		if (numDoc.length < 8 || numDoc.length === 9 || numDoc.length > 10) {
			setErrorsNumDoc(["El número de documento debe tener 8 o 10 números."]);
			return;
		} else {
			setErrorsNumDoc([]);
		}

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
			firstNameClient: firstNameClient,
			secondNameClient: secondNameClient,
			SurnameClient: SurnameClient,
			secondSurnameClient: secondSurnameClient,
			numDocument: numDocument,
			phone: phone,
			idUser: idUser,
			idDocumentType: idDocumentType,
			idCompany: idCompany,
			statusClient: statusClient
		});
		navigate(-1);
	};

	const handleGoBack = () => {
		navigate(-1); // Regresar a la página anterior
	};

	return (
		<div className="container-fluid mt-4 px-md-5">
			<h1 className="text-center mb-4">CREAR CLIENTE</h1>
			<div className="container-fluid mt-4 px-md-5 d-flex align-items-center justify-content-center">
				<div className="d-flex justify-content-center border p-2 rounded w-50 rounded">
					<form onSubmit={store} className="col-md-6 w-75">
						<div className="mb-3">
							<label className="form-label fs-5">Primer Nombre</label>
							<input
								type="text"
								value={firstNameClient}
								onChange={(e) => setFirstNameClient(e.target.value)}
								className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Segundo Nombre</label>
							<input
								type="text"
								value={secondNameClient}
								onChange={(e) => setSecondNameClient(e.target.value)}
								className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
							/>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Primer Apellido</label>
							<input
								type="text"
								value={SurnameClient}
								onChange={(e) => setSurnameClient(e.target.value)}
								className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Segundo Apellido</label>
							<input
								type="text"
								value={secondSurnameClient}
								onChange={(e) => setSecondSurnameClient(e.target.value)}
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
										errorsNumDoc.length > 0 ? "is-invalid" : ""
									}`}
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
							<label className="form-label fs-5">Nombre del Usuario</label>
							<select
								value={idUser}
								onChange={(e) => setIdUser(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom" required>
								<option disabled selected>Seleccione el nombre de la persona que esta registrando el cliente</option>
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{`${user.firstName || ""} ${user.Surname}`}
									</option>
								))}
							</select>
						</div>
						<div className="mb-3">
							<label className="form-label fs-5">Estado</label>
							<select
								value={statusClient}
								onChange={(e) => setStatusClient(e.target.value)}
								className="form-select border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
							>
								<option value="Activo">Activo</option>
								<option value="Inactivo">Inactivo</option>
							</select>
						</div>
						<div className="mb-3 text-center">
							<button onClick={handleGoBack} className="btn btn-warning btn-md mx-1" > Cancelar </button>
							<button type="submit" className="btn btn-primary" tabIndex="4"> Guardar </button>
						</div>
					</form>
				</div>
			</div>
			<br></br>
		</div>
	);
};

export default CreateClient;
