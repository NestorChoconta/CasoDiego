<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class CompanyController extends Controller
{
    public function index()
    {
        $company = DB::table('companies')->get();
        return Response::json($company);
    }

    public function store(Request $request)
    {
        $company = new Company();

        //se capturan los valores que se tienen en el formulario
        $company->name = $request->name;
        $company->adress = $request->adress;
        $company->phone = $request->phone;
        $company->nit = $request->nit;
        $company->client_serv_contract = $request->client_serv_contract;
        $company->statusCompany = $request->statusCompany;
        $company->verification_code = $request->verification_code;
        $company->idService = $request->idService;

        //con el metodo save se guarda todo en la tabla
        $company->save();

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
