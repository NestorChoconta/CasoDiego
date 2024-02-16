import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LogoutButton = () => {
	const navigate = useNavigate();
	const handleLogout = () => {
		axios
			.post("http://localhost:8000/api/logout")
			.then((response) => {
				// Manejar la respuesta del logout (redirección, limpieza de datos de sesión, etc.)
				console.log("cierre de sesión exitoso");
				Cookies.remove('casoDiego');
				navigate("/");
			})
			.catch((error) => {
				console.error("Error al hacer cierre de sesión", error);
			});
	};

	return (
		<button onClick={handleLogout} className="btn btn-danger btn-md mx-">
			Cerrar Sesión
		</button>
	);
};

export default LogoutButton;
