<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->string('image')->nullable(); // To store image path
        $table->json('categories')->nullable(); // categories as JSON array
        $table->string('meta_title')->nullable();
        $table->text('meta_description')->nullable();
        $table->string('focus_keyword')->nullable();
        $table->string('slug')->unique();
        $table->string('canonical_url')->nullable();
        $table->string('robots_tag')->default('index, follow');
        $table->string('og_title')->nullable();
        $table->text('og_description')->nullable();
        $table->string('og_image')->nullable();
        $table->boolean('featured')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
