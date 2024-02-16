<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class ClientController extends Controller
{
    public function index()
    {
        //El metodo all sirve para traer todos los registros de la tabla
        $client = DB::table('clients')->join('users', 'clients.idUser', '=', 'users.id')
            ->join('document_types', 'clients.idDocumentType', '=', 'document_types.id')
            ->join('companies', 'clients.idCompany', '=', 'companies.id')
            ->select('clients.*', 'users.firstName', 'users.Surname', 'document_types.description', 'companies.name')
            ->get();
        return Response::json($client);
    }

    public function store(Request $request)
    {
        $client = new Client();

        //se capturan los valores que se tienen en el formulario
        $client->firstNameClient = $request->firstNameClient;
        $client->secondNameClient = $request->secondNameClient;
        $client->SurnameClient = $request->SurnameClient;
        $client->secondSurnameClient = $request->secondSurnameClient;
        $client->numDocument = $request->numDocument;
        $client->phone = $request->phone;
        $client->idUser = $request->idUser;
        $client->idDocumentType = $request->idDocumentType;
        $client->idCompany = $request->idCompany;
        $client->statusClient = $request->statusClient;

        //con el metodo save se guarda todo en la tabla
        $client->save();

        return Response::json([
            'client' => $client
        ]);
    }

    public function show(string $id)
    {
        //El metodo find sirve para traer solo un registro
        $client = Client::find($id);
        return $client;
    }

    public function update(Request $request, string $id)
    {
        // Busca el usuario por su ID
        $client = Client::find($id);

        // Captura los valores que se modificaron en el formulario
        $client->firstNameClient = $request->firstNameClient;
        $client->secondNameClient = $request->secondNameClient;
        $client->SurnameClient = $request->SurnameClient;
        $client->secondSurnameClient = $request->secondSurnameClient;
        $client->numDocument = $request->numDocument;
        $client->phone = $request->phone;
        $client->idUser = $request->idUser;
        $client->idDocumentType = $request->idDocumentType;
        $client->idCompany = $request->idCompany;
        $client->statusClient = $request->statusClient;
        //Guardar los cambios 
        $client->save();

        return Response::json([
            'client' => $client
        ]);
    }

    public function destroy(string $id)
    {
        $client = Client::destroy($id);
        return $client;
    }
}
