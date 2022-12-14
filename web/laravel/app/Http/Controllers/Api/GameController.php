<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function createGame(Request $request)
    {
        $request->validate([
            'jsonGame' => 'required',
            'date' => 'required',
            'difficulty' => 'required',
            'category' => 'required',
            'type' => 'required',
        ]);

        $game = new Game();
        $game->jsonGame = $request->jsonGame;
        $game->date = $request->date;
        $game->difficulty = $request->difficulty;
        $game->category = $request->category;
        $game->type = $request->type;

        if ($game->save()) {
            return response()->json($game->id, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }

    // public function createDailyGame()
    // {
    //     $json_data = file_get_contents('https://the-trivia-api.com/api/questions?limit=10&difficulty=medium');
    //     $game = new Game();
    //     $game->jsonGame = $json_data;
    //     $game->date = date("Y-m-d");
    //     $game->difficulty = 'medium';
    //     $game->category = 'all';
    //     $game->type = 'daily';
    //     $game->save();
    // }

    public function getGame(Request $request)
    {
        $game = Game::find($request->id);
        return response()->json(["game" => $game], Response::HTTP_OK);
    }

    public function getDailyGame()
    {
        $id = DB::table('game')->where('type', 'daily')->where('date', date("Y-m-d"))->value('id');
        $game = Game::find($id);
        return response()->json(["game" => $game], Response::HTTP_OK);
    }
}
