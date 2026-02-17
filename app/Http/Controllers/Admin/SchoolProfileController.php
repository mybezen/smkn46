<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolProfile\UpdateHeadmasterRequest;
use App\Http\Requests\SchoolProfile\UpdateHistoryRequest;
use App\Http\Requests\SchoolProfile\UpdateProfileRequest;
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
        }

        SchoolProfile::updateOrCreate(['type' => 'HISTORY'], $validated);

        return redirect()->back()->with('success', 'History updated successfully.');
    }
}
