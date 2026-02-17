<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 'content' => for HEADMASTER, PROFILE, HISTORY (rich text/HTML).
     * 'data' => for VISION_MISSION, ORGANIZATION_STRUCTURE (data, image, static).
     */
    public function up(): void
    {
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->enum('type', [
                'HEADMASTER',
                'PROFILE',
                'HISTORY',
                'VISION_MISSION',
                'ORGANIZATION_STRUCTURE',
            ])->unique();
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->json('data')->nullable();
            $table->string('main_image')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_profiles');
    }
};
