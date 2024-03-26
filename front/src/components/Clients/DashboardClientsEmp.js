import React, { useEffect } from "react"
import clientes from "../../img/clientes.png";
import compañias from "../../img/compañias.png";
import Cookies from "js-cookie"
import { useNavigate} from "react-router-dom"
import { useSelector }	 from "react-redux"

const DashboardClientsEmp = () => {
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
			<h1>CLIENTES</h1>
			<br />
			<div className="row justify-content-center">
				<div className="col-md-4 ">
					<div className="card" style={{ width: "104%" }}>
						<img src={clientes} className="card-img-top mx-auto d-block mt-2 mb-3" style={{ width: "50%" }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">CLIENTES NORMALES</h1>
							<p className="card-text">Aqui puedes ver todos los clientes normales</p>
							<a href="/clientes" className="btn btn-success">
								Ver clientes
							</a>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card" style={{ width: "105%" }}>
						<img src={compañias} className="card-img-top mx-auto d-block mt-4 mb-3" style={{ width: "50%" }} alt=""/>
						<div className="card-body">
							<h1 className="card-title">CLIENTES JURIDICOS</h1>
							<p className="card-text">Aqui puedes ver todas las clientes juridicos</p>
							<a href="/compañiasEmple" className="btn btn-success">
								Ver clientes
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardClientsEmp;
