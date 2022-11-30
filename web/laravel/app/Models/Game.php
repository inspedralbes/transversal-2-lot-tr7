<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Game extends Model
{
    use HasApiTokens, HasFactory;

    protected $table = "game";

    protected $fillable = [
        'jsonGame',
        'date',
        'difficulty',
        'category',
        'type',
    ];
}
