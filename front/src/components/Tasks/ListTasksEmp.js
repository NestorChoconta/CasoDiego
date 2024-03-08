import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FiUsers, FiBriefcase } from 'react-icons/fi';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const endpoint = "http://localhost:8000/api";

const TaskEmp = () => {
    const [tasks, setTasks] = useState([]);
    const [editStatus, setEditStatus] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const tasksPerPage = 11;
    const navigate = useNavigate();

    const token = Cookies.get("casoDiego");
    const decodificacionToken = jwtDecode(token);
    const idUser = decodificacionToken.id;

    useEffect(() => {
        if (Cookies.get("casoDiego") === undefined) {
            navigate("/");
        }

        getAllTasks();
    }, [pageNumber, navigate]);

    const getAllTasks = async () => {
        try {
            const response = await axios.get(`${endpoint}/tasks`);
            const userTasks = response.data.filter(task => task.idEmpleado === idUser);
            setTasks(userTasks);
        } catch (error) {
            console.error("Error fetching users with tasks:", error);
        }
    };

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const updateStatus = async (taskId) => {
        try {
            await axios.put(`${endpoint}/taskEmp/${taskId}`, {
                status: newStatus,
            });

            // Actualiza la lista de tareas después de la edición
            getAllTasks();
            setEditStatus(null);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const handleEditStatus = (taskId, currentStatus) => {
        // Al hacer clic en editar, establece el estado de edición y guarda el estado actual
        setEditStatus(taskId);
        setNewStatus(currentStatus); // Configura el nuevo estado con el estado actual
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const Sidebar = ({ isOpen, toggleSidebar }) => {
        return (
            isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '200px',
                    height: '100%',
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '20px',
                    boxSizing: 'border-box',
                    zIndex: 100,
                }}>
                    <button
                        onClick={toggleSidebar}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '20px',
                        }}>
                        X
                    </button>
                    <ul style={{
                        listStyleType: 'none',
                        padding: 0,
                    }}>
                        <li style={{ marginBottom: '30%', marginTop: '30%', cursor: 'pointer' }}>
                            <Link to={'/MenuEmple'} style={{ color: 'white', textDecoration: 'none' }}>
                                ☰ Menú Principal
                            </Link>
                        </li>
                        <li style={{ marginBottom: '30%', cursor: 'pointer' }}>
                            <Link to={'/clientes'} style={{ color: 'white', textDecoration: 'none' }}>
                                <FiUsers style={{ marginRight: '10px' }} /> Clientes
                            </Link>
                        </li>
                        <li style={{ marginBottom: '30%', cursor: 'pointer' }}>
                            <Link to={'/compañiasEmple'} style={{ color: 'white', textDecoration: 'none' }}>
                                <FiBriefcase style={{ marginRight: '10px' }} /> Compañias
                            </Link>
                        </li>

                    </ul>
                </div>
            )
        );
    }

    // Calcula la cantidad de páginas necesarias para mostrar todas las tareas
    const pageCount = Math.ceil(tasks.length / tasksPerPage);

    // Sirve para obtener las tareas de la página actual
    const offset = pageNumber * tasksPerPage;
    const paginatedTasks = tasks.slice(offset, offset + tasksPerPage);

    return (
        <div className="container-fluid mt-4 px-md-5">
            <h1>MIS TAREAS</h1>
            <button
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'black',
                    fontSize: '20px',
                }}>
                ☰ {/* Icono de hamburguesa */}
            </button>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <table
                className="table table-striped table-bordered shadow-lg table-hover mt-4"
                style={{ fontSize: "16px", width: "80%", margin: "auto" }}>
                <thead className="thead-light">
                    <tr>
                        <th scope="col" className="col-4 align-middle text-center">
                            Descripción Tarea
                        </th>
                        <th scope="col" className="col-2 align-middle text-center">
                            Empleado
                        </th>
                        <th scope="col" className="col-2 align-middle text-center">
                            Estado
                        </th>
                        <th scope="col" className="col-4 align-middle text-center">
                            Acción
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTasks.map((task) => (
                        <tr key={task.id}>
                            <td className="align-middle text-center">{task.description}</td>
                            <td className="align-middle text-center">
                                {`${task.firstName || ""} ${task.Surname || ""}` ||
                                    "Sin Empleado"}
                            </td>
                            <td className="align-middle text-center">
                                {editStatus === task.id ? ( // Si editStatus es igual al ID de la tarea, muestra un campo de selección
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="form-select border-bottom">
                                        <option value="Por iniciar">Por iniciar</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Finalizada">Finalizada</option>
                                    </select>
                                ) : (
                                    task.status // Si no está en modo de edición, muestra el estado actual de la tarea
                                )}
                            </td>
                            <td className="align-middle text-center">
                                {editStatus !== task.id ? ( // Si editStatus no es igual al ID de la tarea, muestra los btones
                                    <button
                                        //Se llama handleEditStatus para pasar el ID de la tarea y el estado actual.
                                        onClick={() => handleEditStatus(task.id, task.status)}
                                        className="btn btn-danger btn-md mx-1">
                                        Editar Estado
                                    </button>
                                ) : (
                                    <div>
                                        <button
                                            onClick={() => updateStatus(task.id)}
                                            className="btn btn-success btn-md mx-1">
                                            Guardar Cambios
                                        </button>
                                        <button
                                            onClick={() => setEditStatus(null)}
                                            className="btn btn-danger btn-md mx-1">
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Siguiente"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"pagination mt-4 justify-content-center"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                disabledClassName={"page-item disabled"}
                activeClassName={"page-item active"}
                pageLinkClassName={"page-link"} // Agregar esta línea para estilizar los números de página
            />
        </div>
    );
};

export default TaskEmp;
