<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('accounts', static function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('parent_id')->nullable()->index();
            $table->string('name');
            $table->string('url')->nullable();
            $table->string('avatar')->nullable();
            $table->string('account_email')->nullable();
            $table->string('account_address');
            $table->string('account_postcode');
            $table->string('account_country');
            $table->string('account_phone_number')->nullable();
            $table->string('website_address')->nullable();

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
        Schema::dropIfExists('accounts');
    }
}
