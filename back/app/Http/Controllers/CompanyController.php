<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CompanyController extends Controller
{
    public function index()
    {
        $company = Company::with('services')->get();
        return Response::json($company);
    }

    public function store(Request $request)
    {
        $company = new Company();

        //se capturan los valores que se tienen en el formulario
        $company->name = $request->name;
        $company->address = $request->address;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->documents = $request->documents;
        $company->statusCompany = $request->statusCompany;
        $company->verification_code = $request->verification_code;

        //con el metodo save se guarda todo en la tabla
        $company->save();

        //guardar los servicios relacionados con la compañía
        $company->services()->sync($request->input('idService', []));

        return Response::json([
            'company' => $company
        ]);
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
