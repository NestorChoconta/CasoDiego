import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [token, setToken] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:8000/api/login", {
				email,
				password,
			});

			const { access_token } = response.data; // Recibir el token de la respuesta del servidor
			setToken(access_token);
			console.log("Token de acceso:", access_token);
			//Para que el token se almacene en la cookie
			Cookies.set("casoDiego", access_token);

			let data = response["data"];

			const idRole = data["idRole"];
			const data2 = {
				email: email,
				password: password,
				idRole: idRole,
				firstName: data["user"]["firstName"],
				Surname: data["user"]["Surname"],
				id: data["user"]["id"],
			};

			dispatch(addUser(data2));

			if (idRole === 1) {
				navigate("/MenuSuperAdmin");
			} else if (idRole === 2) {
				navigate("/MenuAdmin");
			} else if (idRole === 3) {
				navigate("/MenuEmple");
			} else {
				navigate("/");
			}
		} catch (error) {
			setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
			console.log(error);
		}
	};

	return (
		<div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
			<div className="border p-4 rounded w-25">
				<h2 className="text-center mb-4">Iniciar sesión</h2>
				{error && <div className="alert alert-danger">{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="email" className="form-label fs-5">
							Email:
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label fs-5">
							Contraseña:
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="form-control border-0 rounded-0 rounded-end-2 rounded-start-2 border-bottom"
						/>
					</div>
					<button type="submit" className="btn btn-success">
						Iniciar sesión
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
