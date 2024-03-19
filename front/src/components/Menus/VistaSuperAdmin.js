import React, { useEffect } from "react"
import usuarios from '../../img/usuarios.png'
import clientes from '../../img/clientes.png'
import compañias from '../../img/compañias.png'
import servicios from '../../img/servicios.png'
import LogoutButton from "../Login/LogouthButton"
import tareas from '../../img/tareas.png'
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { useSelector }	 from "react-redux"

const MenuSuperAdmin = () => {
	const navigate = useNavigate();
	const user = useSelector(state => state.user)

	useEffect(()=> {
		if (Cookies.get('casoDiego')=== undefined) {
			navigate('/')
		}
		console.log(user)
	}, [])

	return (
		<div className="container mt-5"> 
		<h1>MENU SUPER ADMINISTRADOR</h1> <br/>
			<div className="d-flex justify-content-end align-items-center">
				<LogoutButton /><br/><br/>
			</div><br/>
			<div className="row">
				<div className="col-md-4">
					<div className="card">
						<img src={usuarios} className="card-img-top mx-auto d-block mt-3" style={{ width: '50%' }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">USUARIOS</h1>
							<p className="card-text">Aqui puedes ver todos los usuarios</p>
							<a href="/usuarios" className="btn btn-success">
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
							<a href="/clientesSuper" className="btn btn-success">
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
							<a href="/compañias" className="btn btn-success">
								Ver Compañias
							</a>
						</div>
					</div>
				</div>
				<div className="col-md-4 mb-4" style={{ marginLeft: '170px' }}><br/>
					<div className="card">
						<img src={servicios} className="card-img-top mx-auto d-block mt-4 mb-3" style={{ width: '50%' }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">SERVICIOS</h1>
							<p className="card-text">Aqui puedes gestionar los servicios</p>
							<a href="/Servicios" className="btn btn-success">
								Ver servicios
							</a>
						</div>
					</div>
				</div>
				<div className="col-md-4 mb-4" style={{ marginLeft: '10px' }}><br/>
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
			</div>
		</div>
		
		
		
	);
};

export default MenuSuperAdmin;
