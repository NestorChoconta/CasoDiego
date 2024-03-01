<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/roles', [RoleController::class, 'index']);
Route::get('/document-types', [DocumentTypeController::class, 'index']);

Route::controller(UserController::class)->group(function () {
    Route::get('/usuarios', 'index');
    Route::post('/usuario', 'store');
    Route::get('/usuario/{id}', 'show');
    Route::put('/usuario/{id}', 'update');
    Route::delete('/usuario/{id}', 'destroy');
    Route::get('/regular-users', 'getRegularUsers');
});

Route::controller(ClientController::class)->group(function () {
    Route::get('/clientes', 'index');
    Route::post('/cliente', 'store');
    Route::get('/cliente/{id}', 'show');
    Route::put('/cliente/{id}', 'update');
    Route::delete('/cliente/{id}', 'destroy');
    Route::post('/importarClientes', 'importClients');
});


Route::controller(CompanyController::class)->group(function () {
    Route::get('/companies', 'index');
    Route::post('/company/verify', 'store');
    Route::post('/company', 'VerifyCreateCompany'); // Ruta para crear el codigo
});

Route::get('/servicios', [ServiceController::class, 'index']);

Route::controller(TaskController::class)->group(function (){
    Route::get('/tasks', 'index');
    Route::post('/task', 'store');
    Route::get('/task/{id}', 'show');
    Route::put('/task/{id}', 'update');
    Route::put('/taskEmp/{id}', 'updateEstado');
    Route::delete('/tasks/{id}', 'destroy');
});

Route::controller(LoginController::class)->group(function (){
    Route::post('/login', 'login');
    Route::post('/logout', 'logout');
    Route::post('/verify-code', 'verifyCode');
});
