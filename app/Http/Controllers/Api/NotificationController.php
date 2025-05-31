<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'link' => 'nullable|string',
        ]);

        $notification = Notification::create($request->only(['title', 'link']));
        return response()->json($notification, 201);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $request->validate([
            'title' => 'required|string',
            'link' => 'nullable|string',
        ]);

        $notification->update($request->only(['title', 'link']));
        return response()->json($notification);
    }

    public function destroy($id)
    {
        Notification::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
