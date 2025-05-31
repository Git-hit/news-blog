<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::orderBy('created_at', 'desc')->get();

        return response()->json($posts);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        // Delete image from storage if exists
        if ($post->image && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048', // max 2MB
            'categories' => 'nullable|array',
            'slug' => 'required|string|unique:posts,slug',
            // Add other validations as needed
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public'); // saved to storage/app/public/posts
        }

        $ogImagePath = null;
        if ($request->hasFile('ogImage')) {
            $ogImagePath = $request->file('ogImage')->store('og_images', 'public'); // or reuse 'posts'
        }

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imagePath,
            'categories' => $request->categories ? json_encode($request->categories) : null,
            'meta_title' => $request->metaTitle,
            'meta_description' => $request->metaDescription,
            'focus_keyword' => $request->focusKeyword,
            'slug' => $request->slug,
            'canonical_url' => $request->canonicalUrl,
            'robots_tag' => $request->robotsTag ?? 'index, follow',
            'og_title' => $request->ogTitle,
            'og_description' => $request->ogDescription,
            'og_image' => $ogImagePath,
            'featured' => filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN) ? 1 : 0,
        ]);

        return response()->json(['message' => 'Post created successfully', 'post' => $post, 'status' => 200], 201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'categories' => 'nullable|array',
            'slug' => 'required|string|unique:posts,slug,' . $post->id,
        ];

        // Only validate as image if file is uploaded
        if ($request->hasFile('image')) {
            $rules['image'] = 'nullable|image|max:2048';
        }

        if ($request->hasFile('ogImage')) {
            $rules['ogImage'] = 'nullable|image|max:2048';
        }

        $request->validate($rules);

        // Start with old paths
        $imagePath = $post->image;
        $ogImagePath = $post->og_image;

        // Update image if new file is uploaded
        if ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        // Update OG image if new file is uploaded
        if ($request->hasFile('ogImage')) {
            if ($ogImagePath && Storage::disk('public')->exists($ogImagePath)) {
                Storage::disk('public')->delete($ogImagePath);
            }
            $ogImagePath = $request->file('ogImage')->store('og_images', 'public');
        }

        // Build update array
        $updateData = [
            'title' => $request->title,
            'content' => $request->content,
            'categories' => $request->categories ? json_encode($request->categories) : null,
            'meta_title' => $request->metaTitle,
            'meta_description' => $request->metaDescription,
            'focus_keyword' => $request->focusKeyword,
            'slug' => $request->slug,
            'canonical_url' => $request->canonicalUrl,
            'robots_tag' => $request->robotsTag ?? 'index, follow',
            'og_title' => $request->ogTitle,
            'og_description' => $request->ogDescription,
            'featured' => filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN) ? 1 : 0,
        ];

        // Only include images if they're newly uploaded
        if ($request->hasFile('image')) {
            $updateData['image'] = $imagePath;
        }

        if ($request->hasFile('ogImage')) {
            $updateData['og_image'] = $ogImagePath;
        }

        $post->update($updateData);

        return response()->json(['message' => 'Post updated successfully', 'post' => $post]);
    }

    public function show($id)
    {
        $post = Post::findOrFail($id);
        return response()->json(['post' => $post]);
    }

    public function showBySlug($slug)
{
    Log::info($slug);
    $post = Post::where('slug', $slug)->firstOrFail();
    return response()->json(['post' => $post]);
}

public function incrementViews($slug)
{
    $post = Post::where('slug', $slug)->first();

    if (!$post) {
        return response()->json(['message' => 'Post not found'], 404);
    }

    $post->increment('views');

    return response()->json(['message' => 'View count incremented']);
}
}
