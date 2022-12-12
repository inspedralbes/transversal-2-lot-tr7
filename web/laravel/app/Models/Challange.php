<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Challange extends Model
{
    use HasApiTokens, HasFactory;

    protected $table = "challange";

    protected $fillable = [
        'idSender',
        'idReceiver',
        'idGame',
        'idWinner',
        'date',
    ];
}
