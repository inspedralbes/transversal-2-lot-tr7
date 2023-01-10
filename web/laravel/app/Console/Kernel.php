<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use App\Models\Game;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $json_data = file_get_contents('https://the-trivia-api.com/api/questions?limit=10&difficulty=medium');
            $game = new Game();
            $game->jsonGame = $json_data;
            $game->date = date("Y-m-d");
            $game->difficulty = 'medium';
            $game->category = 'all';
            $game->type = 'daily';
            $game->save();
        })->cron('1 0 * * *');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
