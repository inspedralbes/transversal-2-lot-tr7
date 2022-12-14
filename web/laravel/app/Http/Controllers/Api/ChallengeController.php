<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class ChallengeController extends Controller
{
    public function createChallenge(Request $request)
    {
        $request->validate([
            'idReceiver' => 'required',
            'idGame' => 'required',
        ]);

        $challenge = new Challenge();
        $challenge->idSender = auth()->user()->id;
        $challenge->idReceiver = $request->idReceiver;
        $challenge->idGame = $request->idGame;
        $challenge->date = date("Y-m-d");

        if ($challenge->save()) {
            return response()->json(true, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }

    public function challengeWinner(Request $request)
    {
        // $request->validate([
        //     'idGame' => 'required',
        //     'idWinner' => 'required',
        // ]);

        $ids = DB::select(DB::raw('SELECT id FROM challange WHERE (idSender = ' . auth()->user()->id . ' OR idReceiver = ' . auth()->user()->id) . ') AND idWinner IS NULL');
        for ($i = 0; $i < count($ids); $i++) {
        }
        // $score = Challenge::find($id);
        // $score->idWinner = $request->idWinner;

        // if ($score->save()) {
        //     return response()->json(true, Response::HTTP_CREATED);
        // } else {
        //     return response()->json(false, Response::HTTP_BAD_REQUEST);
        // }

        echo print_r($ids);
    }

    public function challengesList()
    {
        $userId = auth()->user()->id;
        $challenges['completed'] = DB::select(DB::raw('SELECT idSender, idReceiver, idGame, idWinner, date FROM challange WHERE idWinner IS NOT NULL AND (idSender = ' . $userId . ' OR idReceiver = ' . $userId . ')'));
        for ($i = 0; $i < count($challenges['completed']); $i++) {
            $challenges['completed'][$i]->sender = DB::table('user')->where('id', $challenges['completed'][$i]->idSender)->value('username');
            $challenges['completed'][$i]->receiver = DB::table('user')->where('id', $challenges['completed'][$i]->idReceiver)->value('username');
            $challenges['completed'][$i]->winner = DB::table('user')->where('id', $challenges['completed'][$i]->idWinner)->value('username');
            $challenges['completed'][$i]->senderPoints = DB::table('score')->where('id', $challenges['completed'][$i]->idGame)->where('idUser', $challenges['completed'][$i]->idSender)->value('points');
            $challenges['completed'][$i]->receiverPoints = DB::table('score')->where('id', $challenges['completed'][$i]->idGame)->where('idUser', $challenges['completed'][$i]->idReceiver)->value('points');
        }

        $challenges['pending'] = DB::select(DB::raw('SELECT idSender, idReceiver, idGame, date FROM challange WHERE idWinner IS NULL AND (idSender = ' . $userId . ' OR idReceiver = ' . $userId . ')'));
        for ($i = 0; $i < count($challenges['pending']); $i++) {
            $challenges['pending'][$i]->sender = DB::table('user')->where('id', $challenges['pending'][$i]->idSender)->value('username');
            $challenges['pending'][$i]->receiver = DB::table('user')->where('id', $challenges['pending'][$i]->idReceiver)->value('username');
        }

        return response()->json(["challenges" => $challenges], Response::HTTP_OK);
    }
}
