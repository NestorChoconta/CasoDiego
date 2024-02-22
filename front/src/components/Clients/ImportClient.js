import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

const endpoint = "http://localhost:8000/api";

const ImportClient = ({ closeModal }) => {
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("casoDiego") === undefined) {
			navigate("/");
		}
	}, []);

	const onSubmit = async (data) => {
		try {
			const file = data.file[0];

			// Validar la extensión del archivo
			const allowedExtensions = [".xls", ".xlsx", ".csv"];
			const fileExtension = file.name
				.substring(file.name.lastIndexOf("."))
				.toLowerCase();

			// Valida que se haya seleccionado un archivo
			if (!allowedExtensions.includes(fileExtension)) {
				toast.error("Por favor, seleccione un archivo Excel o CSV.");
				return;
			}

			// Crea un objeto FormData y adjunta el archivo
			const formData = new FormData();
			formData.append("file", file);


			await axios.post(`${endpoint}/importarClientes`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			closeModal();
			toast.success("Importación exitosa");

			// Forzar la recarga de la página actual
			window.location.reload();
		} catch (error) {
			console.error("Error al importar el archivo", error);
			handleError(error);
		}
	};

	const handleError = (error) => {
		if (error.response && error.response.status === 422) {
			toast(error.response.data.error, {
				appearance: "error",
				autoDismiss: true,
			});
		} else {
			toast("Error desconocido. Inténtalo de nuevo.", {
				appearance: "error",
				autoDismiss: true,
			});
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
									required: "Por favor, seleccione un archivo Excel o CSV.",
									validate: (value) => {
										const fileExtension = value[0].name
											.substring(value[0].name.lastIndexOf("."))
											.toLowerCase();
										return [".xls", ".xlsx", ".csv"].includes(fileExtension);
									},
								})}
								className="form-control rounded-0 rounded-end-2 rounded-start-2 border-bottom"
							/>
						</div>
						<div className="mb-3 text-center">
							<Link to="/clientesSuper" className="btn btn-warning btn-md mx-1">
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
