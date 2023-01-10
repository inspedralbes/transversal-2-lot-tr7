<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Score;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class ScoreController extends Controller
{
    public function createScore(Request $request)
    {
        $request->validate([
            'idGame' => 'required',
        ]);

        $score = new Score();
        $score->idUser = auth()->user()->id;
        $score->idGame = $request->idGame;
        $score->completed = false;

        if ($score->save()) {
            return response()->json(true, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }

    public function updateScore(Request $request)
    {
        $request->validate([
            'idGame' => 'required',
            'points' => 'required',
            'time' => 'required',
        ]);

        $id = DB::table('score')->where('idUser', auth()->user()->id)->where('idGame', $request->idGame)->value('id');
        $score = Score::find($id);
        $score->points = $request->points;
        $score->time = $request->time;
        $score->completed = true;

        $user = User::find(auth()->user()->id);
        $totalPoints = DB::table('score')->where('idUser', $user->id)->sum('points');
        $user->level = round($totalPoints / 2000, 0);

        if ($score->save() && $user->save()) {
            return response()->json(true, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }
}
