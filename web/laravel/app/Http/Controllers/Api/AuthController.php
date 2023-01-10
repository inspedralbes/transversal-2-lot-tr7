<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:user',
            'email' => 'required|email|unique:user',
            'password' => 'required|confirmed',
        ]);

        $user = new User();
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->level = 0;

        if ($user->save()) {
            return response()->json(true, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            return response()->json(["login" => true, "token" => $token, "user" => $user], Response::HTTP_OK);
        } else {
            return response()->json(["login" => false], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function myProfile()
    {
        $userId = auth()->user()->id;
        $statistics = array();
        array_push($statistics, DB::select(DB::raw('SELECT COUNT(*) as totalGames FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT COUNT(*) as gamesUncompleted FROM score WHERE idUser = ' . $userId . ' AND completed = 0'))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT SUM(time) as totalTime FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT AVG(time) as averageTimePerGame FROM score WHERE idUser = ' . $userId . ' AND completed = 1'))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT SUM(points) as totalPoints FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT AVG(points) as averagePointsPerGame FROM score WHERE idUser = ' . $userId . ' AND completed = 1'))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT MAX(points) as maxGamePoints FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT MAX(created_at) as lastGamePlayed FROM score WHERE idUser = ' . $userId))[0]);
        return response()->json(["userData" => auth()->user(), "statistics" => $statistics], Response::HTTP_OK);
    }

    public function userProfile(Request $request)
    {
        $request->validate([
            'idUser' => 'required',
        ]);

        $userId = $request->idUser;
        $statistics = array();
        array_push($statistics, DB::select(DB::raw('SELECT COUNT(*) as totalGames FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT COUNT(*) as gamesUncompleted FROM score WHERE idUser = ' . $userId . ' AND completed = 0'))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT SUM(time) as totalTime FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT AVG(time) as averageTimePerGame FROM score WHERE idUser = ' . $userId . ' AND completed = 1'))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT SUM(points) as totalPoints FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT AVG(points) as averagePointsPerGame FROM score WHERE idUser = ' . $userId . ' AND completed = 1'))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT MAX(points) as maxGamePoints FROM score WHERE idUser = ' . $userId))[0]);
        array_push($statistics, DB::select(DB::raw('SELECT MAX(created_at) as lastGamePlayed FROM score WHERE idUser = ' . $userId))[0]);
        return response()->json(["userData" => User::find($userId), "statistics" => $statistics], Response::HTTP_OK);
    }

    public function usersList()
    {
        $usersList = DB::table('user')->where('id', '!=', auth()->user()->id)->pluck('username', 'id');
        return response()->json(["usersList" => $usersList], Response::HTTP_OK);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'password' => 'confirmed',
        ]);

        $user = User::find(auth()->user()->id);
        if ($request->username) {
            $user->username = $request->username;
        }
        if ($request->email) {
            $user->email = $request->email;
        }
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        if ($user->save()) {
            return response()->json(true, Response::HTTP_CREATED);
        } else {
            return response()->json(false, Response::HTTP_BAD_REQUEST);
        }
    }

    public function ranking()
    {
        $ranking['dailyGame'] = DB::select(DB::raw('SELECT idUser, points FROM score WHERE completed = 1 AND idGame = (SELECT id FROM game WHERE type = "daily" AND date = "' . date("Y-m-d") . '" ) ORDER BY points DESC LIMIT 10'));
        for ($i = 0; $i < count($ranking['dailyGame']); $i++) {
            $ranking['dailyGame'][$i]->username = DB::table('user')->where('id', $ranking['dailyGame'][$i]->idUser)->value('username');
        }

        $ranking['totalPoints'] = DB::select(DB::raw('SELECT idUser, SUM(points) as pSum FROM score WHERE completed = 1 GROUP BY idUser ORDER BY pSum DESC LIMIT 10'));
        for ($i = 0; $i < count($ranking['totalPoints']); $i++) {
            $ranking['totalPoints'][$i]->username = DB::table('user')->where('id', $ranking['totalPoints'][$i]->idUser)->value('username');
        }

        $ranking['totalGames'] = DB::select(DB::raw('SELECT idUser, COUNT(idUser) as pSum FROM score WHERE completed = 1 GROUP BY idUser ORDER BY pSum DESC LIMIT 10'));
        for ($i = 0; $i < count($ranking['totalGames']); $i++) {
            $ranking['totalGames'][$i]->username = DB::table('user')->where('id', $ranking['totalGames'][$i]->idUser)->value('username');
        }

        $ranking['averagePoints'] = DB::select(DB::raw('SELECT idUser, AVG(points) as pSum FROM score WHERE completed = 1 GROUP BY idUser ORDER BY pSum DESC LIMIT 10'));
        for ($i = 0; $i < count($ranking['averagePoints']); $i++) {
            $ranking['averagePoints'][$i]->username = DB::table('user')->where('id', $ranking['averagePoints'][$i]->idUser)->value('username');
        }

        return response()->json(["ranking" => $ranking], Response::HTTP_OK);
    }
}
