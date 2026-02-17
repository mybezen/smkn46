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

class SchoolProfileController extends Controller
{
    public function getHeadmaster()
    {
        $headMaster = SchoolProfile::where('type', 'HEADMASTER')->first();

        // return $headMaster (data: title, content, main_image);
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

    public function getProfile()
    {
        $profile = SchoolProfile::where('type', 'PROFILE')->first();

        // return $profile (data: title, content, main_image);
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

    public function getHistory()
    {
        $history = SchoolProfile::where('type', 'HISTORY')->first();

        // return $history (data: title, content, main_image);
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

    public function getVisionMission()
    {
        $visionMission = SchoolProfile::where('type', 'VISION_MISSION')->first();

        // return $visionMission (data: title, data, main_image);
    }

    public function updateVisionMission(UpdateVisionMissionRequest $request)
    {
        $validated = $request->validated();

        $visionMission = SchoolProfile::where('type', 'VISION_MISSION')->first();

        $data = [
            'vision' => $validated['vision'],
            'mission' => $validated['mission'],
            'motto' => $validated['motto'],
        ];

        if ($request->hasFile('main_image')) {
            if ($visionMission?->main_image) {
                Storage::disk('public')->delete($visionMission->main_image);
            }

            $file = $request->file('main_image');

            $validated['main_image'] = Storage::disk('public')->putFile('school_profiles', $file);
        } else {
            $validated['main_image'] = $visionMission?->main_image;
        }

        SchoolProfile::updateOrCreate(
            ['type' => 'VISION_MISSION'],
            [
                'title' => $validated['title'],
                'data' => $data,
                'main_image' => $validated['main_image'],
            ]
        );

        return redirect()->back()->with('success', 'Vision Mission updated successfully.');
    }

    public function getOrganizationStructure()
    {
        $organizationStructure = SchoolProfile::where('type', 'ORGANIZATION_STRUCTURE')->first();

        // return $organizationStructure (data: title, data);
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
