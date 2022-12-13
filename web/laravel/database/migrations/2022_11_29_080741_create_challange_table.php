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
            $table->unsignedBigInteger('idSender');
            $table->unsignedBigInteger('idReceiver');
            $table->unsignedBigInteger('idGame');
            $table->unsignedBigInteger('idWinner')->nullable();
            $table->string('date');
            $table->timestamps();
            $table->foreign('idSender')->references('id')->on('user');
            $table->foreign('idReceiver')->references('id')->on('user');
            $table->foreign('idGame')->references('id')->on('game');
            $table->foreign('idWinner')->references('id')->on('user');
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
