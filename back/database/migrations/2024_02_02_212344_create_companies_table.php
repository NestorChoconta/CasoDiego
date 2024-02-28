<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('adress', 50);
            $table->BigInteger('phone');
            $table->BigInteger('nit')->unique();
            $table->binary('client_serv_contract');
            $table->enum('statusCompany', ['Activa', 'Inactiva'])->default('Activa');
            $table->string('verification_code')->nullable();
            $table->unsignedInteger('idService');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
