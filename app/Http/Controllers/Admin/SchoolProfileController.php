<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolProfile\UpdateHeadmasterRequest;
use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SchoolProfileController extends Controller
{
    public function getHeadmaster()
    {
        $headMaster = SchoolProfile::where('type', 'HEADMASTER')->first();

        // return $headMaster;
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

            $validated['main_image'] = Storage::disk('public')->putFile('headmaster', $file);
        }

        SchoolProfile::updateOrCreate(['type' => 'HEADMASTER'], $validated);

        return redirect()->back()->with('success', 'Headmaster updated successfully.');
    }
}
