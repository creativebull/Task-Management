<?php

namespace App\Models;

use App\Traits\TableUUID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkspaceMembers extends Model
{
    use HasFactory, TableUUID;
}
