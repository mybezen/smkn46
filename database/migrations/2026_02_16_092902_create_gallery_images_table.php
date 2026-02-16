<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['HEADMASTER', 'PROFILE', 'VISION-MISSION', 'HISTORY', 'FACILITIES', 'STRUCTURE-ORGANIZATION',]);
            $table->text('content')->nullable();
            $table->integer('index')->default(0);
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
