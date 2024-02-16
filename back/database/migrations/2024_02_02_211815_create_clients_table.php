<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('firstNameClient', 20);
            $table->string('secondNameClient', 20)->nullable();
            $table->string('SurnameClient', 20);
            $table->string('secondSurnameClient', 20)->nullable();
            $table->BigInteger ('numDocument');
            $table->BigInteger ('phone');
            $table->unsignedInteger('idUser');
            $table->unsignedInteger('idDocumentType');
            $table->unsignedInteger('idCompany');
            $table->enum('statusClient', ['Activo', 'Inactivo'])->default('Activo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
