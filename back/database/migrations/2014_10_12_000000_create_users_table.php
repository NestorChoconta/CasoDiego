<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstName', 20);
            $table->string('secondName', 20)->nullable();
            $table->string('Surname', 20);
            $table->string('secondSurname', 20)->nullable();
            $table->BigInteger ('numDocument')->unique();
            $table->date('birthdate');
            $table->string('email', 50)->unique();
            $table->string('password', 255)->unique();
            $table->BigInteger ('phone')->unique();
            $table->string('adress', 50);
            $table->unsignedInteger('idRole');
            $table->string('verification_code')->nullable();
            $table->unsignedInteger('idDocumentType');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /*
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
