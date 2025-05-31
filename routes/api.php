
<?php

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PostController;
use App\Mail\ContactFormSubmitted;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

// use App\Models\Category;

Route::get('/news', [PostController::class, 'index']);

Route::get('/notifications', [NotificationController::class, 'index']);

Route::post('/posts/{slug}/increment-views', [PostController::class, 'incrementViews']);

Route::post('/contact', function (Request $request) {
    $validated = $request->validate([
        'firstName' => 'required|string|max:255',
        'lastName' => 'required|string|max:255',
        'email' => 'required|email',
        'phone' => 'nullable|string|max:20',
        'message' => 'required|string|max:2000',
        'country' => 'nullable|string|max:10',
    ]);

    // Send email
    Mail::to('contact@dailytrendnews.in')->send(new ContactFormSubmitted($validated));

    return response()->json(['message' => 'Message received and email sent'], 200);
});

Route::post('/subscribe', function (Request $request) {
    $validated = Validator::make($request->all(), [
        'email' => 'required|email|unique:subscribers,email',
    ]);

    if ($validated->fails()) {
        return response()->json(['message' => 'Invalid or duplicate email.'], 422);
    }

    $email = $request->input('email');

    // 1. Send email to yourself
    Mail::raw("New newsletter subscriber: $email", function ($message) use ($email) {
        $message->to('contact@dailytrendnews.com') // your receiving email
                ->subject('New Newsletter Subscriber');
    });

    // 2. Store to DB
    Subscriber::create(['email' => $email]);

    return response()->json(['message' => 'Subscribed successfully!']);
});

Route::get('/posts/slug/{slug}', [PostController::class, 'showBySlug']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out']);
    });

    Route::get('/categories', function () {
        return DB::table('categories')->get();
    });

    Route::post('/categories', function (Request $request) {
    $request->validate([
        'name' => 'required|string|unique:categories,name',
    ]);

    $id = DB::table('categories')->insertGetId([
        'name' => $request->name,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $category = DB::table('categories')->where('id', $id)->first();

    return response()->json($category);
    });

    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::get('/posts/{id}', [PostController::class, 'show']);

    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}', [NotificationController::class, 'update']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});
