<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Challange;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChallangeController extends Controller
{
    public function createChallange(Request $request)
    {
        $request->validate([
            'idReceiver' => 'required',
            'idGame' => 'required',
        ]);

        $challange = new Challange();
        $challange->idSender = auth()->user()->id;
        $challange->idReceiver = $request->idReceiver;
        $challange->idGame = $request->idGame;
        $challange->date = date("Y-m-d");

        if ($challange->save()) {
            return response()->json(true, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }
}
