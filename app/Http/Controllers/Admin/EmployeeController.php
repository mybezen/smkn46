<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $employees = Employee::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where('name', 'like', '%' . $search . '%');
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where('category', $request->category);
            })
            ->orderBy('display_order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/employees/create');
    }

    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();

        $validated['display_order'] = match ($validated['category']) {
            'PRINCIPAL' => 0,
            'HEAD_OF_ADMIN' => 1,
            'VICE_PRINCIPAL' => 2,
            'TEACHER' => 3,
            'ADMINISTRATIVE' => 4,
            'STAFF' => 5,
            default => 5,
        };

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            $validated['image'] = Storage::disk('public')->putFile('employees', $file);
        }

        Employee::create($validated);

        return redirect()->route('admin.employees.index')->with('success', 'Employee created successfully.');
    }

    public function edit(string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return redirect()->back()->with('error', 'Employee not found.');
        }

        return Inertia::render('admin/employees/edit', [
            'employee' => $employee,
        ]);
    }

    public function update(UpdateEmployeeRequest $request, string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return redirect()->back()->with('error', 'Employee not found.');
        }

        $validated = $request->validated();

        $validated['display_order'] = match ($validated['category']) {
            'PRINCIPAL' => 0,
            'HEAD_OF_ADMIN' => 1,
            'VICE_PRINCIPAL' => 2,
            'TEACHER' => 3,
            'ADMINISTRATIVE' => 4,
            'STAFF' => 5,
            default => 5,
        };

        if ($request->hasFile('image')) {
            if ($employee->image && Storage::disk('public')->exists($employee->image)) {
                Storage::disk('public')->delete($employee->image);
            }

            $file = $request->file('image');

            $validated['image'] = Storage::disk('public')->putFile('employees', $file);
        } else {
            unset($validated['image']);
        }

        $employee->update($validated);

        return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return redirect()->back()->with('error', 'Employee not found.');
        }

        if ($employee->image && Storage::disk('public')->exists($employee->image)) {
            Storage::disk('public')->delete($employee->image);
        }

        $employee->delete();

        return redirect()->route('admin.employees.index')->with('success', 'Employee deleted successfully.');
    }
}