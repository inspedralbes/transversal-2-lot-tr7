<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
            return response()->json(true, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }

    public function getGame(Request $request)
    {
        $game = Game::find($request->id);
        return response()->json(["game" => $game], Response::HTTP_OK);
    }
}
