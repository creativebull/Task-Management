<?php

namespace App\Console\Commands;

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DeleteOldSoftDeletes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:soft_deletes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans up old soft deletes in the database';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        // Models to check
        $models = [
            User::class,
            Task::class,
            Board::class,
            BoardList::class,
        ];

        foreach ($models as $model) {

            $this->info('Doing cleanup for: ' . $model);

            $model = new $model;
            $this->deleteAll($model);
        }

        return 0;
    }

    /**
     * @param Model $model
     * @return void
     */
    private function deleteAll(Model $model): void
    {
        DB::enableQueryLog();
        $results = $model::withTrashed()->where(
            'deleted_at', '<=', now()->subMonths(6)->toDateTimeString()
        )->get();
        $this->info(print_r(DB::getQueryLog(), true));

        $results->each->forceDelete();
    }
}
