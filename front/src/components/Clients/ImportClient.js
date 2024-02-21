import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import { useForm } from "react-hook-form";

const endpoint = "http://localhost:8000/api";

const ImportClient = () => {
	const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    useEffect(()=> {
		if (Cookies.get('casoDiego')=== undefined) {
			navigate('/')
		}
	})

	const onSubmit = async (data) => {
		try {
			const file = data.file[0];

			//Validar la extensión del archivo
			const allowedExtensions = [".xls", ".xlsx", ".csv"];
			const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

            //Valida que se haya seleccionado un archivo 
			if (!allowedExtensions.includes(fileExtension)) {
				alert("Por favor, seleccione un archivo Excel o CSV.");
				return;
			}

            //Crea un objeto FormData y adjunta el archivo 
			const formData = new FormData();
			formData.append("file", file);

			//Realizar una solicitud POST al endpoint de Laravel para importar el archivo
			await axios.post(`${endpoint}/importarClientes`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			alert("Importación exitosa");
		} catch (error) {
			console.error("Error al importar el archivo", error);
			alert("Error al importar el archivo");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label>Seleccionar archivo Excel o CSV:</label>
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
				/>
			</div>
			<div>
				<button type="submit">Importar</button>
			</div>
		</form>
	);
};

export default ImportClient;
