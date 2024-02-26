import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

const endpoint = "http://localhost:8000/api";

const ImportClient = ({ closeModal, onImportFinish }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}
	}, []);

	//Para el boton de cancelar 
	const closeModalAndNavigate = () => {
		closeModal();
		navigate("/clientesSuper");
	};

	//verifica si el archivo seleccionado es un archivo Excel o CSV
	const validateFile = (value) => {
		const fileExtension = value[0]?.name
			.substring(value[0]?.name.lastIndexOf("."))
			.toLowerCase();

		if (![".xlsx", ".csv"].includes(fileExtension)) {
			return "El archivo debe ser Excel o CSV.";
		}

		return true; // Validación exitosa
	};

	const onSubmit = async (data) => {
		try {
			const file = data.file[0];

			const validationError = validateFile(data.file);

			if (validationError !== true) {
				toast.error(validationError);
				return;
			}

			const formData = new FormData();
			formData.append("file", file);

			await axios.post(`${endpoint}/importarClientes`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			closeModal();
			
		} catch (error) {
			console.error("Error al importar el archivo", error);
		} finally {
			// Notificar a ListClients que la importación ha finalizado
			onImportFinish();
		}
	};

	return (
		<div>
			<h1 className="text-center mb-4">IMPORTAR CLIENTES </h1>
			<div className="container-fluid mt-4 px-md-5 d-flex align-items-center justify-content-center">
				<div className="d-flex justify-content-center border p-2 rounded w-100 rounded">
					<form onSubmit={handleSubmit(onSubmit)} className="col-md-6 w-100">
						<div className="mb-3">
							<div className="text-center">
								<label className="form-label fs-5">
									Selecciona archivo Excel o CSV de Clientes
								</label>
							</div>
							<input
								type="file"
								{...register("file", {
									required: "Por favor, seleccione un archivo.",
									validate: validateFile,
								})}
								className={`form-control rounded-0 rounded-end-2 rounded-start-2 border-bottom ${
									errors.file ? "is-invalid" : ""
								}`}
							/>
							{errors.file && (
								<p className="text-danger">{errors.file.message}</p>
							)}
						</div>
						<div className="mb-3 text-center">
							<Link
								onClick={closeModalAndNavigate}
								className="btn btn-warning btn-md mx-1"
							>
								Cancelar
							</Link>
							<button type="submit" className="btn btn-primary" tabIndex="4">
								Importar
							</button>
						</div>
					</form>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default ImportClient;
