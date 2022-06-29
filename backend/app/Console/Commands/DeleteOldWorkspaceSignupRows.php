<?php

namespace App\Console\Commands;

use App\Models\WorkspaceInvite;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DeleteOldWorkspaceSignupRows extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'workspaceInvite:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes old workspace signup rows';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        // Find all rows in the WorkspaceInvite table that are older than 4 weeks
        $rows = WorkspaceInvite::query()
            ->where('expires_at', '<', now()->subWeeks(4))
            ->get();

        // Delete each row
        foreach ($rows as $row) {
            $row->delete();
        }

        Log::info('Deleted ' . count($rows) . ' rows from the WorkspaceInvite table');

        return 0;
    }
}
