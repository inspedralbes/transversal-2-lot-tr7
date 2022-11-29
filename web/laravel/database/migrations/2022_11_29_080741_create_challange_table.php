<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('challange', function (Blueprint $table) {
            $table->id();
            $table->integer('idSender');
            $table->integer('idSender');
            $table->integer('idGame');
            $table->integer('idWinner');
            $table->string('data');
            $table->timestamps();
            //$table->foreign('idSender')->references('id')->on('user');
            //$table->foreign('idSender')->references('id')->on('user');
            //$table->foreign('idGame')->references('id')->on('game');
            //$table->foreign('idWinner')->references('id')->on('user');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('challange');
    }
};
