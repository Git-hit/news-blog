<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        if (Auth::user()->role !== 'admin') {
            Auth::logout();
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['message' => 'Logged in', 'token' => csrf_token(),]);
    }

    return response()->json(['message' => 'Invalid credentials'], 401);
});
