<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class DocumentTypeController extends Controller
{
    public function index()
    {
        $documentTypes = DB::table('document_types')->get();
        return Response::json($documentTypes);
    }
}
