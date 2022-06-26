<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskUserAccessRequest;
use App\Http\Requests\UpdateTaskUserAccessRequest;
use App\Models\TaskUserAccess;
use Illuminate\Http\Response;

class TaskUserAccessController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreTaskUserAccessRequest $request
     * @return Response
     */
    public function store(StoreTaskUserAccessRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param TaskUserAccess $taskUserAccess
     * @return Response
     */
    public function show(TaskUserAccess $taskUserAccess)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateTaskUserAccessRequest $request
     * @param TaskUserAccess $taskUserAccess
     * @return Response
     */
    public function update(UpdateTaskUserAccessRequest $request, TaskUserAccess $taskUserAccess)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param TaskUserAccess $taskUserAccess
     * @return Response
     */
    public function destroy(TaskUserAccess $taskUserAccess)
    {
        //
    }
}
