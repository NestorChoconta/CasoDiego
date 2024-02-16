<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class RoleController extends Controller
{
    public function index()
    {
        $roles = DB::table('roles')->get();
        return Response::json($roles);
    }
}
