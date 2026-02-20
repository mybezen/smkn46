<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\UpdateSettingRequest;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $setting = Setting::first();
        
        return $setting;
    }

    public function update(UpdateSettingRequest $request)
    {
        $setting = Setting::instance();

        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            if ($setting->logo && Storage::disk('public')->exists($setting->logo)) {
                Storage::disk('public')->delete($setting->logo);
            }

            $file = $request->file('logo');

            $validated['logo'] = Storage::disk('public')->putFile('settings', $file);
        } else {
            unset($validated['logo']);
        }

        $setting->update($validated);

        return back()->with('success', 'Setting updated successfully.');
    }
}
