<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Task;
use Illuminate\Support\Facades\Response;

class TaskController extends Controller
{

    public function index()
    {
        $tasks = DB::table("tasks")->join('users', 'tasks.idEmpleado', '=', 'users.id')
            ->select('tasks.*', 'users.firstName', 'users.Surname')
            ->get();

        return response()->json($tasks);
    }

    public function updateEstado(Request $request, string $id)
    {
        $task = Task::find($id);

        $task->status = $request->status;

        $task->save();

        return response()->json($task, 201);
    }

    public function store(Request $request)
    {
        $task = new Task();

        $task->description = $request->description;
        $task->status = $request->status;
        $task->idEmpleado = $request->idEmpleado;

        $task->save();

        return response()->json($task, 201);
    }

    public function show(string $id)
    {
        $task = Task::find($id);
        return response()->json($task);
    }


    public function update(Request $request, string $id)
    {
        $task = Task::find($id);

        $task->description = $request->description;
        $task->status = $request->status;
        $task->idEmpleado = $request->idEmpleado;

        $task->save();

        return response()->json($task, 201);
    }

    public function destroy(string $id)
    {
        $task = Task::destroy($id);
        return  $task;
    }
}
