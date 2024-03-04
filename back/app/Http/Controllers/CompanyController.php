<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use PHPUnit\TextUI\XmlConfiguration\Logging\Logging;

class CompanyController extends Controller
{
    public function index()
    {
        $company = Company::with('services')->get();
        return Response::json($company);
    }


    public function VerifyCreateCompany(Request $request)
    {
        // Aquí solo se recopilan los datos del formulario y se envía el código de verificación
        // No se guarda la compañía en la base de datos en este punto
        $verification_code = mt_rand(100000, 999999); // Generar código de verificación único

        // Envía el código de verificación en la respuesta
        return Response::json([
            'verification_code' => $verification_code
        ]);
    }

    public function store(Request $request)
    {
        //if ($request->verification_code === $request->user_verification_code) {

        $company = new Company();
        //se capturan los valores que se tienen en el formulario
        $company->name = $request->name;
        $company->adress = $request->adress;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->documents = $request->documents;
        $company->statusCompany = $request->statusCompany;
        $company->verification_code = $request->verificationCode;

        //con el metodo save se guarda todo en la tabla
        $company->save();
        //guardar los servicios relacionados con la compañía
        $company->services()->sync($request->input('idService', []));
        return Response::json([
            'company' => $company,
            'message'=>'Verificación exitosa'
        ], 200);
        //} else  {
            //return Response::json([
              //  'message' => 'codigo de verificación no valido'
            //], 400);
        }



    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
