<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolProfileController extends Controller
{
    public function getProfile()
    {
        $profile = SchoolProfile::where('type', 'PROFILE')->first();

        // return Inertia::render('admin/profile/profile/index', [
        //     'profile' => $profile?->only(['title', 'content', 'main_image']),
        // ]);
    }

    public function getHistory()
    {
        $history = SchoolProfile::where('type', 'HISTORY')->first();

        // return Inertia::render('admin/profile/history/index', [
        //     'history' => $history?->only(['title', 'content', 'main_image']),
        // ]);
    }

    public function getVisionMission()
    {
        $visionMission = SchoolProfile::where('type', 'VISION_MISSION')->first();

        // return Inertia::render('admin/profile/vision-mission/index', [
        //     'visionMission' => $visionMission?->only(['title', 'data', 'main_image']),
        // ]);
    }

    public function getOrganizationStructure()
    {
        $organizationStructure = SchoolProfile::where('type', 'ORGANIZATION_STRUCTURE')->first();

        // return Inertia::render('admin/profile/organization-structure/index', [
        //     'organizationStructure' => $organizationStructure?->only(['title', 'data']),
        // ]);
    }
}
