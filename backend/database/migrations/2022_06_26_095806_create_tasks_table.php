<?php

use App\Models\Task;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('tasks', static function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('identifier')->unique();
            $table->unsignedBigInteger('user_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', Task::statuses())->default(Task::TODO);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
