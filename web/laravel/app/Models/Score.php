<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Score extends Model
{
    use HasApiTokens, HasFactory;

    protected $table = "score";

    protected $fillable = [
        'idUser',
        'idGame',
        'points',
        'time',
        'completed',
    ];
}
