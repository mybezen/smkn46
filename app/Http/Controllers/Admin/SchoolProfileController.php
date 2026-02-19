<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolProfile\UpdateHeadmasterRequest;
use App\Http\Requests\SchoolProfile\UpdateHistoryRequest;
use App\Http\Requests\SchoolProfile\UpdateOrganizationStructureRequest;
use App\Http\Requests\SchoolProfile\UpdateProfileRequest;
use App\Http\Requests\SchoolProfile\UpdateVisionMissionRequest;
use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SchoolProfileController extends Controller
{
    public function getHeadmaster(): Response
    {
        $headMaster = SchoolProfile::where('type', 'HEADMASTER')->first();

        return Inertia::render('admin/profile/headmaster/index', [
            'headmaster' => $headMaster?->only(['title', 'content', 'main_image']),
        ]);
    }

    public function updateHeadmaster(UpdateHeadmasterRequest $request)
    {
        $validated = $request->validated();

        $profile = SchoolProfile::where('type', 'HEADMASTER')->first();

        if ($request->hasFile('main_image')) {
            if ($profile?->main_image) {
                Storage::disk('public')->delete($profile->main_image);
            }

            $file = $request->file('main_image');

            $validated['main_image'] = Storage::disk('public')->putFile('school_profiles', $file);
        } else {
            unset($validated['main_image']);
        }

        SchoolProfile::updateOrCreate(['type' => 'HEADMASTER'], $validated);

        return redirect()->back()->with('success', 'Headmaster updated successfully.');
    }

    public function getProfile(): Response
    {
        $profile = SchoolProfile::where('type', 'PROFILE')->first();

        return Inertia::render('admin/profile/profile/index', [
            'profile' => $profile?->only(['title', 'content', 'main_image']),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $validated = $request->validated();

        $profile = SchoolProfile::where('type', 'PROFILE')->first();

        if ($request->hasFile('main_image')) {
            if ($profile?->main_image) {
                Storage::disk('public')->delete($profile->main_image);
            }

            $file = $request->file('main_image');

            $validated['main_image'] = Storage::disk('public')->putFile('school_profiles', $file);
        } else {
            unset($validated['main_image']);
        }

        SchoolProfile::updateOrCreate(['type' => 'PROFILE'], $validated);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function getHistory(): Response
    {
        $history = SchoolProfile::where('type', 'HISTORY')->first();

        return Inertia::render('admin/profile/history/index', [
            'history' => $history?->only(['title', 'content', 'main_image']),
        ]);
    }

    public function updateHistory(UpdateHistoryRequest $request)
    {
        $validated = $request->validated();

        $history = SchoolProfile::where('type', 'HISTORY')->first();

        if ($request->hasFile('main_image')) {
            if ($history?->main_image) {
                Storage::disk('public')->delete($history->main_image);
            }

            $file = $request->file('main_image');

            $validated['main_image'] = Storage::disk('public')->putFile('school_profiles', $file);
        } else {
            unset($validated['main_image']);
        }

        SchoolProfile::updateOrCreate(['type' => 'HISTORY'], $validated);

        return redirect()->back()->with('success', 'History updated successfully.');
    }

    public function getVisionMission(): Response
    {
        $visionMission = SchoolProfile::where('type', 'VISION_MISSION')->first();

        return Inertia::render('admin/profile/vision-mission/index', [
            'visionMission' => $visionMission?->only(['title', 'data', 'main_image']),
        ]);
    }

    public function updateVisionMission(UpdateVisionMissionRequest $request)
    {
        $validated = $request->validated();

        $visionMission = SchoolProfile::where('type', 'VISION_MISSION')->first();

        $data = [
            'vision' => $validated['vision'],
            'missions' => $validated['missions'],
            'motto' => $validated['motto'],
        ];

        if ($request->hasFile('main_image')) {
            if ($visionMission?->main_image) {
                Storage::disk('public')->delete($visionMission->main_image);
            }

            $file = $request->file('main_image');

            $mainImage = Storage::disk('public')->putFile('school_profiles', $file);
        } else {
            $mainImage = $visionMission?->main_image;
        }

        SchoolProfile::updateOrCreate(
            ['type' => 'VISION_MISSION'],
            [
                'title' => $validated['title'],
                'data' => $data,
                'main_image' => $mainImage,
            ]
        );

        return redirect()->back()->with('success', 'Vision Mission updated successfully.');
    }

    public function getOrganizationStructure(): Response
    {
        $organizationStructure = SchoolProfile::where('type', 'ORGANIZATION_STRUCTURE')->first();

        return Inertia::render('admin/profile/organization-structure/index', [
            'organizationStructure' => $organizationStructure?->only(['title', 'data']),
        ]);
    }

    public function updateOrganizationStructure(UpdateOrganizationStructureRequest $request)
    {
        $validated = $request->validated();

        $organizationStructure = SchoolProfile::where('type', 'ORGANIZATION_STRUCTURE')->first();
        $oldPositions = $organizationStructure?->data['positions'] ?? [];

        $positions = [];

        foreach ($validated['positions'] as $index => $position) {
            $oldImage = $oldPositions[$index]['image'] ?? null;

            if ($request->hasFile("positions.$index.image")) {
                if ($oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }

                $image = Storage::disk('public')
                    ->putFile('school_profiles', $request->file("positions.$index.image"));
            } else {
                $image = $oldImage;
            }

            $positions[] = [
                'title' => $position['title'],
                'name' => $position['name'],
                'order' => $position['order'],
                'image' => $image,
            ];
        }

        SchoolProfile::updateOrCreate(
            ['type' => 'ORGANIZATION_STRUCTURE'],
            [
                'title' => $validated['title'],
                'data' => [
                    'positions' => $positions,
                ],
            ],
        );

        return redirect()->back()->with('success', 'Organization Structure updated successfully.');
    }
}
