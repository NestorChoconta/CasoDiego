import React, { useEffect } from "react"
import usuarios from '../../img/usuarios.png'
import clientes from '../../img/clientes.png'
import compañias from '../../img/compañias.png'
import tareas from '../../img/tareas.png'
import LogoutButton from "../Login/LogouthButton"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { useSelector }	 from "react-redux"

const VistaAdmin = () => {
	const navigate = useNavigate();
	const user = useSelector(state => state.user)

	useEffect(()=> {
		if (Cookies.get('casoDiego')=== undefined) {
			navigate('/')
		}
		console.log(user)
	})

	return (
		<div className="container mt-4">
			<h1>ADMINISTRADOR</h1>
			<div className="d-flex justify-content-end align-items-center">
				<LogoutButton /><br/><br/>
			</div><br/>
			<div className="row">
				<div className="col-md-4">
					<div className="card">
						<img src={usuarios} className="card-img-top mx-auto d-block mt-3" style={{ width: '50%' }} 	alt=""/>
						<div className="card-body">
							<h1 className="card-title">USUARIOS</h1>
							<p className="card-text">Aqui puedes ver todos los usuarios</p>
							<a href="/AdUsuarios" className="btn btn-success">
								Ver Usuarios
							</a>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card">
						<img src={clientes} className="card-img-top mx-auto d-block mt-2 mb-3" style={{ width: '50%' }} alt=""/>
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
						<img src={compañias} className="card-img-top mx-auto d-block mt-4 mb-3" style={{ width: '50%' }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">COMPAÑIAS</h1>
							<p className="card-text">Aqui puedes ver todas las compañias</p>
							<a href="" className="btn btn-success">
								Ver Compañias
							</a>
						</div>
					</div>
				</div> 
				<div className="col-md-4"><br/>
					<div className="">
						<img src="" className="" alt=""/>
						<div className="card-body">
							<h1 className="">  </h1>
							<p className=""></p>
						</div>
					</div>
				</div>
				<div className="col-md-4"><br/>
					<div className="card">
						<img src={tareas} className="card-img-top mx-auto d-block mt-4 mb-3" style={{ width: '50%' }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">TAREAS</h1>
							<p className="card-text">Aqui puedes asignar tareas</p>
							<a href="/Tareas" className="btn btn-success">
								Asignar tareas
							</a>
						</div>
					</div>
				</div>
			</div><br/><br/>
		</div>
		
	);
};

export default VistaAdmin;
