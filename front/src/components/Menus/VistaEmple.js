import React, { useEffect } from "react"
import clientes from "../../img/clientes.png";
import compañias from "../../img/compañias.png";
import tareas from "../../img/tareas.png";
import LogoutButton from "../Login/LogouthButton";
import Cookies from "js-cookie"
import { useNavigate} from "react-router-dom"
import { useSelector }	 from "react-redux"

const VistaEmple = () => {
	const navigate = useNavigate();
	const user = useSelector(state => state.user)

	useEffect(()=> {
		if (Cookies.get('casoDiego')=== undefined) {
			navigate('/')
		}
		console.log(user)
	}, [])


	return (
		<div className="container mt-4">
			<h1>USUARIO REGULAR</h1>
			<div className="d-flex justify-content-end align-items-center">
				<LogoutButton />
				<br />
				<br />
			</div>
			<br />
			<div className="row">
				<div className="col-md-4 ">
					<div className="card">
						<img src={clientes} className="card-img-top mx-auto d-block mt-2 mb-3" style={{ width: "50%" }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">CLIENTES</h1>
							<p className="card-text">Aqui puedes ver todos los clientes</p>
							<a href="/clientes" className="btn btn-success">
								Ver clientes
							</a>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card">
						<img src={compañias} className="card-img-top mx-auto d-block mt-4 mb-3" style={{ width: "50%" }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">COMPAÑIAS</h1>
							<p className="card-text">Aqui puedes ver todas las compañias</p>
							<a href="" className="btn btn-success">
								Ver Compañias
							</a>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card">
						<img src={tareas} className="card-img-top mx-auto d-block mt-1 mb-3" style={{ width: "50%" }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">TAREAS</h1>
							<p className="card-text">Aqui puedes ver tareas</p>
							<a href="/TareasEmp" className="btn btn-success">
								Mis Tareas
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VistaEmple;
